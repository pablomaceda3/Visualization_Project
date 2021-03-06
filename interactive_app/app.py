import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/datasets.db"
db = SQLAlchemy(app)

Base = automap_base()

Base.prepare(db.engine, reflect=True)

Malaria_Data = Base.classes.malaria_viz_data
Climate_Data = Base.classes.Temp_CO2_dataset
Mosquito_Data = Base.classes.mosquito_life2
Lyme_Data = Base.classes.Region_Tick_Counts_per_100000
Lyme_Data_US = Base.classes.us_lyme_final

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/ticksPage")
def ticksPage():
    return render_template("ticks.html")

@app.route("/years")
def years():
    """Return a list of years."""
    stmt = db.session.query(Malaria_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    years = []
    for year in df['Year'].unique():
        years.append(int(year))
    return jsonify(years)


@app.route("/specific_year/<year>")
def specific_year(year):
    """Return all country's data for a given year"""
    stmt = db.session.query(Malaria_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    data_for_year = df[(df['Year'] == int(year))]

    years = []
    incidences = []
    for year in data_for_year['Year']:
        years.append(int(year))
    for incidence in data_for_year['value']:
        incidences.append(int(incidence))

    data = {
        "year": years,
        "country": data_for_year.Country.values.tolist(),
        "incidence": incidences
    }

    return jsonify(data)


@app.route("/mosquito")
def mosquito():
    """Return all data for mosquito data table"""
    stmt = db.session.query(Mosquito_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    data = [{key: float(value[i]) for key, value in df.items()}
            for i in range(23)]

    return jsonify(data)

@app.route("/ticks-region")
def ticksregion():
    """Return all data for ticks region data table"""
    stmt = db.session.query(Lyme_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    df['US Region'] = df['US Region'].astype('str')
    df['2000'] = df['2000'].astype('float')
    df['2001'] = df['2001'].astype('float')
    df['2002'] = df['2002'].astype('float')
    df['2003'] = df['2003'].astype('float')
    df['2004'] = df['2004'].astype('float')
    df['2005'] = df['2005'].astype('float')
    df['2006'] = df['2006'].astype('float')
    df['2007'] = df['2007'].astype('float')
    df['2008'] = df['2008'].astype('float')
    df['2009'] = df['2009'].astype('float')
    df['2010'] = df['2010'].astype('float')
    df['2011'] = df['2011'].astype('float')
    df['2012'] = df['2012'].astype('float')
    df['2013'] = df['2013'].astype('float')
    df['2014'] = df['2014'].astype('float')
    df['2015'] = df['2015'].astype('float')
    df['2016'] = df['2016'].astype('float')
    df['2017'] = df['2017'].astype('float')

    data = [{key: value[i] for key, value in df.items()}
        for i in range(5)]
    return jsonify(data)

@app.route("/ticks-us")
def ticksus():
    """Return all data for ticks US data table"""
    stmt = db.session.query(Lyme_Data_US).statement
    df = pd.read_sql_query(stmt, db.session.bind)



    data = [{key: float(value[i]) for key, value in df.items()} for i in range(18)]
    print(data)
    return jsonify(data)

@app.route("/climate")
def climate():
    """Return all data for climate data table"""
    stmt = db.session.query(Climate_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    df['Year'] = df['Year'].astype('float')
    df['Mean'] = df['Mean'].astype('float')
    df['Co2_data_mean_global'] = df['Co2_data_mean_global'].astype('float')
    
    data = [{key: value[i] for key, value in df.items()} for i in range(138)]

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True) 