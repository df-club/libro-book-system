#coding:utf-8
from flask import Flask,request,abort
from chatterbot import ChatBot
bot = ChatBot(
    'Libro Bot',
    storage_adapter='chatterbot.storage.MongoDatabaseAdapter'
)
def r(s):return bot.get_response(s).text

app = Flask(__name__)

@app.route("/libroBot", methods=['GET'])

def answer():
    q = request.args.get('q','')
    return r(q)
if __name__ == "__main__":
    app.debug=True
    app.run(debug=True)


