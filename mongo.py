from pymongo import MongoClient
from bson import ObjectId

class DataBase:
    def __init__(self):
        cluster = MongoClient("mongodb://admin:AdminTop1166060088_SilverDenis05%40gmail.com_aue228_DeTrAdAl2005@217.25.94.249:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5")
        self.db = cluster["volochanovo"]
        
        self.feedback = self.db["feedback"]
        
        
        print("db_init")

    def sendfeedback(self, form):
        self.feedback.insert_one(form)
        return "Done"
    
    def getFeedBacks(self):
        return list(self.feedback.find())
    
    def deleteFeedBack(self, id):
        self.feedback.delete_one({'_id': ObjectId(id)})
        return list(self.feedback.find())
