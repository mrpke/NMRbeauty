#!/usr/bin/python3
import os
#os.chdir(os.path.dirname(__file__))
import sys
#sys.path.append('/var/www/users/')
#sys.path.append('/var/www/users/pyscripts')
import cgitb
import bottle
from bottle import Bottle, run, route, template, request, response, url, SimpleTemplate
#import pyscripts.askmysql as mysql
#import pyscripts.askldap as ldap
#import fdsend
from io import StringIO
import csv
import codecs
import json
import datetime
import random

import numpy as np
from lxml import etree 
from lxml.etree import fromstring
import requests
import re
from bs4 import BeautifulSoup
import datetime

def encode_HTML_specials(string):
    return string.encode("ascii", "xmlcharrefreplace").decode("utf-8")


def mergeTimes(timearray):

    timelist = list()
    temp = list()
    #print(timearray)
    for e, i in enumerate(timearray[0]):
        if e == 0:
            if i != '---':
                if temp:
                    a = (e%6)*10
                    temp.append(str(e//6)+":"+str(a))
                    timelist.append(temp)
                    temp = list()
                    temp.append(i)
                    a = (e%6)*10
                    temp.append(str(e//6)+":"+str(a))
                else:
                    temp.append(i)
                    a = (e%6)*10
                    temp.append(str(e//6)+":"+str(a))
        elif i != timearray[0][e-1]:
            if i != '---':
                if temp:
                    a = (e%6)*10
                    temp.append(str(e//6)+":"+str(a))
                    timelist.append(temp)
                    temp = list()
                    temp.append(i)
                    a = (e%6)*10
                    temp.append(str(e//6)+":"+str(a))
                else:
                    temp.append(i)
                    a = (e%6)*10
                    temp.append(str(e//6)+":"+str(a))
            else:
                a = (e%6)*10
                temp.append(str(e//6)+":"+str(a))
                timelist.append(temp)
                temp = list()
        if e == len(timearray[0])-1:
            if temp:
                temp.append("0:0")
                timelist.append(temp)
    #print(timelist)
    for i in timelist:

        a = i[1].split(":")
        i[1] = int(a[0])*6+int(a[1])//10
        a = i[2].split(":")
        i[2] = 24*6-1 if (int(a[0])*6+int(a[1])//10-1)==-1\
            else int(a[0])*6+int(a[1])//10-1

    return(timelist)







#application = bottle.default_app()
#SimpleTemplate.defaults["get_url"] = application.get_url
secret = "FSCH"

#bottle.debug(True)


@route('/')
def non():
    return template("templates/nmr", instruments=['Today', 'Tomorrow'])

def reserveTime(data, instr, sh, sm, eh, em, day, dd):
    data["rc"] = "R"
    data["sh"] = sh
    data['sm'] = sm
    data['eh'] = eh
    data['em'] = em
    data['I'] = instr
    data['OK'] = "Submit"
    data['DN'] = dd
    data['ID'] = ""
    data['D'] = day
    page = requests.post('http://reslog.cchem.berkeley.edu/webres/web_res.php',
                          data = data
                        )
    print(data)

def cancelTime(data, instr, sh, sm, eh, em, day, dd):
    data["rc"] = "C"
    data["sh"] = sh
    data['sm'] = sm
    data['eh'] = eh
    data['em'] = em
    data['I'] = instr
    data['OK'] = "Submit"
    data['DN'] = dd
    data['ID'] = ""
    data['D'] = day
    page = requests.post('http://reslog.cchem.berkeley.edu/webres/web_res.php',
                          data = data
                        )
    print(data)

def getDataFromLogin(name, code):
    page = requests.post('http://reslog.cchem.berkeley.edu/webres/web_res.php',
                          data = {'name': name,
                                  'code':code,
                                  'Submit':'Login',}
                        )
    soup = BeautifulSoup(page.text, "lxml")
    data = dict()
    data['Login'] = soup.find("input", {"name":"Login"})["value"]
    data['name'] = soup.find("input", {"name":"name"})["value"]
    data['code'] = soup.find("input", {"name":"code"})["value"]
    data['YesNo'] = "1"
    data['group'] = soup.find("input", {"name":"group"})["value"]
    data['account'] = soup.find("input", {"name":"account"})["value"]
    return data

@route('/reserveTimes/<day>/<dd>', method='POST')
def non(day, dd):
    times = request.json[0]
    data = getDataFromLogin(request.json[1], request.json[2])
    # comment reserveTime(data, instr, sh, sm, eh, em)
    print(times)
    for i in times:
        print(i)
        reserveTime(data.copy(), i[0][0], i[0][1], i[0][2], i[0][1], i[0][2]+10, day, dd)
    return "aa"

@route('/cancelTimes/<day>/<dd>', method='POST')
def non(day, dd):
    times = request.json[0]

    data = getDataFromLogin(request.json[1], request.json[2])
    # comment reserveTime(data, instr, sh, sm, eh, em)

    for i in times:
        cancelTime(data.copy(), i[0][0], i[0][1], i[0][2], i[0][1], i[0][2]+10, day, dd)
    return "aa"


@route('/nmrTimes/<instr>/<day>/<dd>')
def non(instr, day, dd):
    page = requests.post('http://reslog.cchem.berkeley.edu/webres/web_res.php',
                          data = {'DN': dd,
                                  'Login':'0',
                                  'name':'',
                                  'code':'',
                                  'ID':'',
                                  'YesNo':'',
                                  'pstr':'',
                                  'ignore_rules':'',
                                  'group':'',
                                  'account':'',
                                  'I': instr,
                                  'D': day,} )
    page.encoding = 'utf-8'
    soup = BeautifulSoup(page.text, "lxml")
    times = np.array(soup.find_all('pre')[0].text.split())
    times = times.reshape(26, 7)[2:, 1:].reshape(1,24*6)
    #return str(times)
    return json.dumps(mergeTimes(times))



@route('/static/<filepath:path>', name='static')
def server_static(filepath):
    return bottle.static_file(filepath, root="C:\\Users\\Michael\\LRZ Sync+Share\\testserv\\NMRbeauty\\static")

run(host='0.0.0.0', port=9090, debug=True)



#run(host='10.152.220.42', port=8080)
