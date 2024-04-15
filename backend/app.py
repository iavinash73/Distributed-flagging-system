import os
import uuid
import bcrypt
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_sqlalchemy import SQLAlchemy
import jwt
from functools import wraps
from scipy.fftpack import  dct
from datetime import datetime, timedelta
from PIL import Image
import numpy as np
from os import listdir
from os.path import isfile, join
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt
from pysyncobj import SyncObj, replicated
import time
from pysentimiento.preprocessing import preprocess_tweet
from pysentimiento import create_analyzer

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///de_flag.db' 
app.config['UPLOAD_PATH'] = 'static/posts'
app.config['SECRET_KEY'] = '3uho2irbfweo14hrufibeqworg1huuf1eb1wouf9823'
db = SQLAlchemy(app)
CORS(app) 
bcrypt = Bcrypt()

cur_port = 50
def get_next_port():
    global cur_port
    cur_port += 1
    if cur_port > 80:
        cur_port = 50
    return cur_port


# #Uncomment it if it can be downloaded
# analyzer = create_analyzer(task = 'hate_speech', lang = 'en')
# def Hate_Text_Analyzer(txt,analyzer):
#     txt = preprocess_tweet(txt)
#     prediction = analyzer.predict(txt)
#     if len(prediction.output) > 0:
#         return True
#     return False

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'Message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            if "username" in data:
                current_user = User.query.filter_by(
                    username=data['username']).first()
                db.session.commit()
            else:
                return jsonify({'message': 'Invalid token!'}), 401
            if current_user is None:
                return jsonify({'message': 'User not found!!'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def MVote(a,b,c,d):
    if a == 1:
        return 1
    elif b == 1:
        return 1
    elif c == 1:
        return 1
    elif d == 1:
        return 1
    return 0

def Hamming_Distance(x, y):
    distance = 0
    for i in range(0,len(x)):
        if x[i] != y[i]:
            distance += 1
    return distance

class HashServer(SyncObj):
    def __init__(self, curServer, othServers, Server_Type, image):
        super(HashServer, self).__init__(curServer, othServers)
        self.curServer = curServer
        self.Server_Type = Server_Type
        self.A_hash = None
        self.D_hash = None
        self.P_hash = None
        self.M_hash = None
        self.image = image
        self.votea = 0
        self.voted = 0
        self.votep = 0
        self.votem = 0

    @replicated
    def Average_Hash(self, size = 8):
        img = self.image.convert('L')
        img = img.resize((size,size),Image.LANCZOS)
        pixels = list(img.getdata())
        avg = sum(pixels) / len(pixels)
        a_hash = "".join(['1' if pixel > avg else '0' for pixel in pixels])
        self.A_hash = a_hash
        return

    @replicated
    def Difference_Hash(self, size = 8):
        img = self.image.convert('L')
        img = img.resize((size+1, size), Image.LANCZOS)
        difference = []
        pixels = list(img.getdata())
        for row in range(size):
            for col in range(size):
                pixel_left = img.getpixel((col, row))
                pixel_right = img.getpixel((col + 1, row))
                difference.append(pixel_left > pixel_right)
        d_hash= ''.join(['1' if bit else '0' for bit in difference])
        self.D_hash = d_hash
        return

    @replicated
    def Perceptual_Hash(self, size = 32):
        img = self.image.convert('L')
        img = img.resize((size, size), Image.LANCZOS)
        pixels = np.asarray(img)
        l = dct(dct(pixels,axis = 0).T, axis = 1)
        reduced_dct = l[:8,:8]
        mid = np.asarray(reduced_dct[1:])
        mean_dct = np.mean(mid)
        op = reduced_dct>mean_dct
        flat_op = np.ndarray.flatten(op)
        p_hash= ''.join(['1' if bit else '0' for bit in flat_op])
        self.P_hash = p_hash
        return

    @replicated
    def Median_Hash(self, size = 8):
        img = self.image.convert('L')
        img = img.resize((size, size), Image.LANCZOS)
        pixels = np.asarray(img)
        l = dct(dct(pixels,axis = 0).T, axis = 1)
        reduced_dct = l[:8,:8]
        mid = np.asarray(reduced_dct[:])
        median_dct = np.median(mid)
        op = reduced_dct > median_dct
        flat_op = np.ndarray.flatten(op)
        m_hash= ''.join(['1' if bit else '0' for bit in flat_op])
        self.M_hash = m_hash
        return

    @replicated
    def Voting_Threshold(self, threshold, reference_hashes):
        error = "Voting is not possible as hash isn't computed yet"
        calc_hash = None
        if self.Server_Type == 1:
            if self.A_hash == None:
                return error
            calc_hash = self.A_hash
        elif self.Server_Type == 2:
            if self.D_hash == None:
                return error
            calc_hash = self.D_hash
        elif self.Server_Type == 3:
            if self.P_hash == None:
                return error
            calc_hash = self.P_hash
        else:
            if self.M_hash == None:
                return error
            calc_hash = self.M_hash
        
        for ref_hash in reference_hashes:
            d = Hamming_Distance(calc_hash, ref_hash)
            if threshold >= d:
                print("Voted")
                if self.Server_Type == 1:
                    self.votea = 1
                elif self.Server_Type == 2:
                    self.voted = 1
                elif self.Server_Type == 3:
                    self.votep = 1
                else:
                    self.votem = 1
                break   
        return

    def Hash_Retrieval(self):
        if self.Server_Type == 1:
            return self.A_hash
        elif self.Server_Type == 2:
            return self.D_hash
        elif self.Server_Type == 3:
            return self.P_hash
        return self.M_hash

 
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    counter = db.Column(db.Integer, nullable=False)
    flagged = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow
    )
    password = db.Column(db.String(255), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def __repr__(self):
        return f"<User {self.username}>"

class ImageDB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phash = db.Column(db.String(120), unique=True, nullable=False)
    ahash = db.Column(db.String(120), unique=True, nullable=False)
    dhash = db.Column(db.String(120), unique=True, nullable=False)
    mhash = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
    
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow
    )

    def __repr__(self):
        return f"<Post {self.title}>"



class ImageHash:
    def __init__(self,image):
        self.image=image

    def average_hash(self,size=8):

        img=self.image
        img=img.convert('L')
        img=img.resize((size,size),Image.LANCZOS)

        pixels=list(img.getdata())
        avg = sum(pixels) / len(pixels)
        self.a_hash= "".join(['1' if pixel > avg else '0' for pixel in pixels])
        
        return self.a_hash
    

    def difference_hash(self,size=8):
        img = self.image.convert('L').resize((size +1, size), Image.LANCZOS)
        difference = []

        pixels = list(img.getdata())

        for row in range(size):

            for col in range(size):

                #get intensity

                pixel_left = img.getpixel((col, row))

                pixel_right = img.getpixel((col + 1, row))

                difference.append(pixel_left > pixel_right)
        
        #print("Intensity difference array:", difference)

   

        #convert the binary difference list to a hexadecimal hash string

        return ''.join(['1' if bit else '0' for bit in difference])
    
    def phash(self,size=8):
        # Reference: https://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html
        self.image = self.image.convert('L')

        self.image = self.image.resize((size, size), Image.LANCZOS)

        pixels = np.asarray(self.image)

        l=dct(dct(pixels,axis=0).T, axis=1)
        #print((l[:8][:8]))
        reduced_dct=l[:8,:8]
        mid=np.asarray(reduced_dct[1:])
        mean_dct=np.mean(mid)
        op=reduced_dct>mean_dct
        flat_op=np.ndarray.flatten(op)
        
        return ''.join(['1' if bit else '0' for bit in flat_op])
    
    def median_phash(self,size=8):
        # Reference: https://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html
        self.image = self.image.convert('L')

        self.image = self.image.resize((size, size), Image.LANCZOS)

        pixels = np.asarray(self.image)

        l=dct(dct(pixels,axis=0).T, axis=1)
        #print((l[:8][:8]))
        reduced_dct=l[:8,:8]
        mid=np.asarray(reduced_dct[:])
        median_dct=np.median(mid)
        op=reduced_dct>median_dct
        flat_op=np.ndarray.flatten(op)
        
        return ''.join(['1' if bit else '0' for bit in flat_op])
        

with app.app_context():
    db.create_all()


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        return jsonify({"message": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(
        data["password"]).decode("utf-8")
    print(hashed_password)
    new_user = User(
        username=data["username"],
        email=data["email"],
        full_name=data["full_name"],
        birthdate=datetime.strptime(data["birthdate"], "%Y-%m-%d").date(),
        gender=data["gender"],
        password=hashed_password,
        counter=0
    )


    db.session.add(new_user)
    db.session.commit()
    access_token = jwt.encode({
            'username': data["username"],
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'])

    return (
        jsonify(
            {
                "message": "User successfully registered. Please check your email to verify.",
                "token":access_token
            }
        ),
        201,
    )



@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user and bcrypt.check_password_hash(user.password, data["password"]):
        if user.flagged:
            return jsonify({"flag": 1}), 200
        access_token = jwt.encode({
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'])
        return jsonify({"message": "Logged in successfully", "token": access_token }), 200
    if not user:
        return jsonify({"error": "No User with this email id exists."}), 401

    return jsonify({"message": "Invalid email or password"}), 200

 
 
  
@app.route('/initdb')
def db_init():    
    files = [f for f in listdir('static/images') if isfile(join('static/images', f))]
    for filename in files:
        image_path = join('static/images', filename)
        image = Image.open(image_path)
        hash_generator = ImageHash(image)
        average_hash = hash_generator.average_hash()
        # print(average_hash)
        diff_hash = hash_generator.difference_hash()
        median_hash = hash_generator.median_phash()
        phash = hash_generator.phash()
        new_image  = ImageDB(
            phash=phash,
            ahash=average_hash,
            dhash=diff_hash,
            mhash=median_hash
        )
        db.session.add(new_image)
        db.session.commit()
    return 'DB initialised with cat images!'


@app.route("/create_post", methods=["POST"])
@token_required
def create_post(current_user):
    global analyzer
    current_user_id = current_user.id
    if 'image' not in request.files:
        return 'No image uploaded', 400

    image_file = request.files['image']
    title = request.form['title']
    
    # #Uncomment this if it can be downloaded
    # title = str(title)
    # hatespeech = Hate_Text_Analyzer(txt = title, analyzer = analyzer)
    # if hatespeech == True:
    #     print("Flagged")
    #     //rest of your logic to block the user
    
    # check if filepath already exists. append random string if it does so if two users upload dog.jpeg the first one wont get overwritten.
    if secure_filename(image_file.filename) in [
        img.content for img in Post.query.all()
    ]:
        unique_str = str(uuid.uuid4())[:8]
        image_file.filename = f"{unique_str}_{image_file.filename}"

    filename = secure_filename(image_file.filename)
    flag = 0
    allow = 1
    if filename:
        file_ext = os.path.splitext(filename)[1]
        if file_ext not in [".jpg", ".png",".jpeg"]:
            return {"error": "File type not supported"}, 400
        
        if not os.path.isdir(app.config['UPLOAD_PATH']):
            os.makedirs(app.config['UPLOAD_PATH'])
        filepath = os.path.join(app.config['UPLOAD_PATH'], filename)
        image_file.save(filepath)
        image = Image.open(filepath)
        port = get_next_port()
        # print(port)
        Ah = HashServer(f'localhost:{port}80', [f'localhost:{port}81', f'localhost:{port}82', f'localhost:{port}83'], 1, image)
        Dh = HashServer(f'localhost:{port}81', [f'localhost:{port}80', f'localhost:{port}82', f'localhost:{port}83'], 2, image)
        Ph = HashServer(f'localhost:{port}82', [f'localhost:{port}80', f'localhost:{port}81', f'localhost:{port}83'], 3, image)
        Mh = HashServer(f'localhost:{port}83', [f'localhost:{port}80', f'localhost:{port}81', f'localhost:{port}82'], 4, image)
        # Ah = HashServer('localhost:8080',['localhost:8081','localhost:8082','localhost:8083'], 1, image)
        # Dh = HashServer('localhost:8081',['localhost:8080','localhost:8082','localhost:8083'], 2, image)
        # Ph = HashServer('localhost:8082',['localhost:8080','localhost:8081','localhost:8083'], 3, image)
        # Mh = HashServer('localhost:8083',['localhost:8080','localhost:8081','localhost:8082'], 4, image)
        
        time.sleep(1)
        
        Alive = 0
        Alive += Ah.isReady()
        Alive += Dh.isReady()
        Alive += Ph.isReady()
        Alive += Mh.isReady()
        
        print("Alive Servers: " + str(Alive))
        references = ImageDB.query.all()
        a_hashref = [ref.ahash for ref in references]
        d_hashref = [ref.dhash for ref in references]
        p_hashref = [ref.phash for ref in references]
        m_hashref = [ref.mhash for ref in references]
        
        Ah.Average_Hash()
        time.sleep(0.5)
        Dh.Difference_Hash()
        time.sleep(0.5)
        Ph.Perceptual_Hash()
        time.sleep(0.5)
        Mh.Median_Hash()
        time.sleep(0.5)
        
        Ah.Voting_Threshold(threshold = 5, reference_hashes = a_hashref)
        time.sleep(0.5)
        Dh.Voting_Threshold(threshold = 5, reference_hashes = d_hashref)
        time.sleep(0.5)
        Ph.Voting_Threshold(threshold = 10, reference_hashes = p_hashref)
        time.sleep(0.5)
        Mh.Voting_Threshold(threshold = 10, reference_hashes = m_hashref)
        time.sleep(0.5)
        
        votes = 0
        votes += MVote(Ah.votea,Dh.votea,Ph.votea,Mh.votea)
        votes += MVote(Ah.voted,Dh.voted,Ph.voted,Mh.voted)
        votes += MVote(Ah.votep,Dh.votep,Ph.votep,Mh.votep)
        votes += MVote(Ah.votem,Dh.votem,Ph.votem,Mh.votem)
        
              
        Ah.destroy()
        Dh.destroy()
        Mh.destroy()
        Ph.destroy()
        
        print("Votes are: " + str(votes))
        
        Quorum = (Alive // 2) + 1
        if votes >= Quorum:
            user = User.query.filter_by(id=current_user_id).first()
            user.counter = user.counter + 1
            if(user.counter == 3):
                flag=1
                user.flagged=1
            allow = 0
            db.session.commit()
        else:
            new_post = Post(title=title, content=filename)
            db.session.add(new_post)
            db.session.commit()
        print(allow)

    return (
        jsonify({"message": "Post created successfully",
                "flag":flag,
                "allow":allow}),
        201,
    )


@app.route("/get_posts", methods=["GET"])
@token_required
def get_posts(current_user):
    posts = Post.query.all()
    posts_data = [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at.isoformat(),
        }
        for post in posts
    ]

    return jsonify(posts_data), 200


@app.route('/')
def index():
    return "checking"

if __name__ == '__main__':
    app.run(debug=True)