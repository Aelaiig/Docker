from flask import Flask
import pymysql
app = Flask(__name__)

db = pymysql.connect("b01_mysql_1", "root", "root", "dbtest")

@app.route("/")
def hello():
    cursor = db.cursor()
    sql = "CREATE TABLE IF NOT EXISTS test (blabla VARCHAR(255))"
    cursor.execute(sql)
    return "<h1>Hello World !</h1>"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081)