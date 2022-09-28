"""
Week 2 Code - IoT
Temp measurement - Sending Data to A Database
""" 

# Import libraries needed for the project
import time
import board
import busio
import digitalio
import json
from board import *
import adafruit_requests as requests
import adafruit_espatcontrol.adafruit_espatcontrol_socket as socket
from adafruit_espatcontrol import adafruit_espatcontrol
from adafruit_onewire.bus import OneWireBus
import adafruit_ds18x20

# Led Setup and control
led = digitalio.DigitalInOut(board.GP18)
led.direction = digitalio.Direction.OUTPUT
led.value = False

# Setup of OneWire for the temperature sensor
ow_bus = OneWireBus(board.GP16)
devices = ow_bus.scan()
ds18b20 = adafruit_ds18x20.DS18X20(ow_bus, devices[0])

# Get wifi details and more from a secrets.py file
try:
    from secrets import secrets
    print("Connecting to", secrets["ssid"])
except ImportError:
    print("WiFi secrets are kept in secrets.py, please add them there!")
    raise

# Initialize UART connection to the ESP8266 WiFi Module
# Pins used for the UART connection
RX = GP1
TX = GP0
# This allows for the communication between the Pico and ESP8266 Module
uart = busio.UART(TX, RX, receiver_buffer_size=2048)  # Use large buffer as 

# This initializes the ESP through the UARt connection
print("ESP AT commands")
esp = adafruit_espatcontrol.ESP_ATcontrol(uart, 115200, debug=False)

# This checks if the ESP is already connected to a WiFi point. 
# If it isn't then it would reset the ESP
if not esp.is_connected:
    print("Resetting ESP module")
    esp.soft_reset()
    esp.MODE_STATION

# This will scan for available WiFi points
for ap in esp.scan_APs():
    print("ESP module Scan")
    print(ap)

# Part of setup for communication on the Internet
requests.set_socket(socket, esp)

# Mongo endpoints and setup
# Update these values!
serverIp = "192.168.50.154" #Update Server IP
name = "Leo" #Update Name and Surname
# Update these values!# Mongo endpoints and setup
JSON_GET_URL = "http://" + serverIp + "/api/getLed/" + name
JSON_POST_URL = "http://" + serverIp + "/api/addTemp/"


# Post and Get setup
attempts = 3  # Number of attempts to retry each request
failure_count = 0
response = None

# How long between queries
TIME_BETWEEN_QUERY = 60  # in seconds

timeStart = TIME_BETWEEN_QUERY
timeVariation = 0

while True:
    timeElapsed = round((time.monotonic() - timeStart) - timeVariation)
    
    # Get the temperature
    temp = round(ds18b20.temperature)

    try:
        # Checks if ESP is connected to WiFi
        # if it isn't then it will attempt to connect
        while not esp.is_connected:
            print("Connecting...")
            esp.connect(secrets)
            
        # Post request
        if timeElapsed > TIME_BETWEEN_QUERY:
            timeVariation = timeElapsed + timeVariation
            
            print("POSTing data to {0}: {1}".format(JSON_POST_URL, temp))
            while not response:
                try:
                    json_data = {"name": name, "temp": temp,}
                    print("POSTing data to {0}: {1}".format(JSON_POST_URL, json_data))
                    response = requests.post(JSON_POST_URL, json=json_data) # The post
                    failure_count = 0
                except AssertionError as error:
                    print("Request failed, retrying...\n", error)
                    failure_count += 1
                    if failure_count >= attempts:
                        raise AssertionError(
                            "Failed to resolve hostname, \
                                            please check your router's DNS configuration."
                        ) from error
                    continue
            json_resp = response.json()
            # Parse out the 'json' key from json_resp dict.
            print("-" * 40)
            print("JSON Data received from server:", json_resp["temp"])
            print("-" * 40)
            response.close()
            response = None
        
        # Get request
        print("Fetching JSON data from %s" % JSON_GET_URL)
        while not response:
            
            try:
                response = requests.get(JSON_GET_URL) #the get request
                # response = requests.request(JSON_GET_URL)
                
                failure_count = 0
            except AssertionError as error:
                print("Request failed, retrying...\n", error)
                failure_count += 1
                if failure_count >= attempts:
                    raise AssertionError(
                        "Failed to resolve hostname, \
                                        please check your router's DNS configuration."
                    ) from error
                continue
        print("-" * 40)
        
        json = response.json()
        if not json:
            print("Database empty")
        else:
            length = len(json)
            print("JSON Response: Led  ", json['led'])
            led.value = json['led']
        
        print("-" * 40)
        response.close()
        response = None

    except (ValueError, RuntimeError, adafruit_espatcontrol.OKError) as e:
        print("Failed to get data, retrying\n", e)
        continue