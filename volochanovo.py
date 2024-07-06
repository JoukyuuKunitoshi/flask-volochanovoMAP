from flask import *
import requests
import os
import mongo


ANDROIN_VERSION = "1.3.0"
FEEDBACK_KEY = "CNQZFZOKP" #/feedback?key=CNQZFZOKP

db = mongo.DataBase()

objects_list = os.listdir("templates/map/components/objects")

img_list = []
for i in objects_list:
    
    img_list.append(i.replace(".html.j2", ""))


print(objects_list)
obj_dict = {'mounds': 'Курганы Волочаново', 
            'park': 'Общественный Парк отдыха деревни', 
            'pound': 'Каскад прудов', 
            'shop': 'Деревенский магазин Волочаново', 
            'theater': 'Культурно-досуговый центр',
            "chapel":"Часовня Волочаново",
            "linden_alley":"Липовая аллея",
            }


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("village/index.html.j2")

@app.route("/contacts")
def contacts():
    return render_template("village/contacts.html.j2")

@app.route("/links")
def links():
    return render_template("village/links.html.j2")

@app.route("/objects")
def objects():
    return render_template("village/objects.html.j2")

@app.route("/heraldry")
def heraldry():
    return render_template("village/heraldry.html.j2")

@app.route("/app")
def aplication():
    return render_template("map/app.html.j2", param=request.args.get("version"), version = ANDROIN_VERSION)

@app.route('/map')
def map():
    if request.args.get("version"):
        version = request.args.get("version")
        print(version)


        if int(version.replace(".",""))  < int(ANDROIN_VERSION.replace(".","")):

            return "oldversion"

    # URL для запроса к API Яндекс.Карт

    
    url = 'https://api-maps.yandex.ru/v3/?apikey=184b6c35-66bb-4f21-a33e-66343fdf7dc7&lang=ru_RU'

    # Делаем запрос
    for _ in range(20):
        response = requests.get(url)
        if response.content.decode("utf-8") != "limited": 
            break
        print("limited avoid")
        
    
    
    return render_template("map/index.html", js=response.content.decode("utf-8"))


@app.route("/attractions")
def attractions():

    obj = request.args.get("obj", None)
    file = obj +".html.j2"
    
    

    if file in objects_list:
        return render_template("map/components/objects/"+file)
    else:
        return "Not a real object"


@app.route("/menu")
def menu():
    
    return render_template("map/components/menu.html.j2", img_list=img_list, obj_dict=obj_dict)

@app.route("/feedback", methods=["POST", "GET"])
def feedback():
    if request.method == "POST":
        fb = dict(request.form)
        if fb.get("_method") == "delete":
            data = db.deleteFeedBack(fb.get("objectID"))
            print(data)

            return render_template("feedback.html.j2", feedbacks=data)

        else:
            
            print(fb)
        
            db.sendfeedback(fb)
            
            return "ok"

    else:
        if request.args.get("key") == FEEDBACK_KEY:
            data = db.getFeedBacks()
            print(data)

            return render_template("feedback.html.j2", feedbacks=data)
        else:
            return "У вас недостаточно прав"



if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")