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

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/malaria.db"
db = SQLAlchemy(app)

Base = automap_base()

Base.prepare(db.engine, reflect=True)

Malaria_Data = Base.classes.malaria_viz_data

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/years")
def years():
    """Return a list of years."""
    stmt = db.session.query(Malaria_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)


    return jsonify(list(df['Year'].unique()))

@app.route("/specific_year/<year>")
def specific_year(year):
    """Return all country's data for a given year"""
    stmt = db.session.query(Malaria_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)


    data = df[(df['Year']==year)]

    return jsonify(data)

if __name__ == "__main__":
    app.run()

