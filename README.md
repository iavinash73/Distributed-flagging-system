# Distributed Flagging System


<p >
A secure social media application which uses Distributed Computing to verify if a image a user wants to post is similar to the images given in the reference database. This is achieved using hashing methods
like Perceptual Hashing, Average hashing, Difference hashing and Median hashing where the hash values are precomputed for reference images in a Database.</p>
<p  >
The uploaded image is then hashed with it's respective hash
and later verified with the precomputed hashes with Hamming Distance and a threshold for the System to decide whether to vote or not for the given image. 
</p>
<p>    
If a Quorum exists the image isn't uploaded to the 
social media and the user is flagged and banned from the application after 2 warnings *(Since this a proof of concept we used Cat Images as the reference image, so you can't post cat images in this server)*. 
</p>


<p align="center" width="100%">
    <kbd>
    <img src="https://github.com/iavinash73/Distributed-flagging-system/blob/main/Output_Images/DemoGIF.gif" ></img>
    </kbd>
</p>


## Image Hashing Algorithms

Image Hashing is a fingerprint of a multimedia file derived from various features from its content. Unlike cryptographic hash functions which rely on the avalanche effect of small changes in input leading to drastic changes in the output here we use Similarity of Images.

Image | Image Hash
-------|-----------
<img src="https://github.com/iavinash73/Distributed-flagging-system/assets/92035508/2ecc0787-342a-47e2-b676-02a53cd20be2"></img>|<img src="https://github.com/iavinash73/Distributed-flagging-system/assets/92035508/d55e3078-7b45-4375-99eb-2da38a6c17e7"></img>
Query Image (Cat) |0xa4ad99b3629076ae

The above is an Example of Image Hashing Where We Query Using an Image and It's Hash is computed on Each Server depending on the algorithm

### Image Hashing Algorithms Implemented

 <ul>
    <li>Perceptual Hash </li>
    <li>Average Hash </li>
    <li>Median Hash </li>
    <li>Difference Hash</li>
  </ul> 

### Perceptual Hash 
Uses <a href="https://en.wikipedia.org/wiki/Discrete_cosine_transform#:~:text=In%20a%20DCT%20algorithm%2C%20an,at%20high%20data%20compression%20ratios."> Discrete Cosine Transform </a>to capture frequencies in the image and 
Perform hash based on the 8x8 upper-left part of image and set bit to 1 if > mean
### Median Hash
Scale Down grayscale Image to 8x8 and compute Median of the values of pixels and set bit to 1 if > median
### Average Hash
Compute the average of the pixel values in the image (8x8) without DCT and compute the hash
### Difference Hash
After Image Scaling and Gray scaling compute dhash by computing the difference between adjacent pixels and compute hash

## What's the need for Multiple Algorithms?
Certain Algorithm are not resistant to image augmentation such as Skewing , Cropping , Contrast changes 

Each Algorithm will have a threshold beyond which the algorithm identifies the image as illegal
so we provide a distributed environment using <a href="https://raft.github.io/">raft consensus protocol</a> where each hash is computed and voted based on its threshold
ensuring:
```
1.Fault Tolerance (Regular Raft Leader Election at select time-intervals)
2.Reliablity (Multiple Servers' Vote Ensure Reliablity)
3.Safety 
```

## System Voting Architecture

<p align="center" width="100%">
    <img src="https://github.com/iavinash73/Distributed-flagging-system/blob/main/Output_Images/system.png"></img>
</p>

* Multiple P-Hash Implementation Servers are initialized using PySyncObj and the class is replicated at an IP Address and a Port.
* They all communicate with each other with Raft Protocol and with Reference values in DB they check if a post is simialar to the reference hashes
* Upon Quorum **(Equivalent to [floor(Alive_Servers / 2) + 1])** if majority of alive servers voted the image to be similar then the user is flagged and image isn't posted else it is posted.
## Software Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,js,tailwind,py,flask,sqlite" />
  </a>
</p>

* **ReactJs, TailwindCSS & Javascript:** Used for the frontend of the Social Media Application (Triple A).
* **JWT Tokens:** Used for representing data securely between client and server.
* **Toaster:** Used for Notifications on successful post, warning for innapropriate post and being banned.
* **Python & Flask:** Programming Language and Micro Web Framework used for the Backend.
* **PySyncObj:** A framework to replicate classes on different IP Addresses & Ports ensuring consensus using RAFT Protocol.
* **SQLite:** Storing the URL for the image posts, user information and reference hashes for each P-hash Implementation.

#### You can check out the immplementation here: [Demo video](https://drive.google.com/file/d/14da6duvrd4muRqXoQK2q86zfd9yDjE0j/view?usp=sharing)

## Replicated Classes and Types:
**The following is the type initilization for the HashServer Class in Backend:**
* ***(Note: Ensure this is the number mapping to server creation otherwise the comparison and hash retrieval will be wrong)***
* Server type 1 is for Average Hash
* Server type 2 is for Difference Hash
* Server type 3 is for Perceptual Hash
* Server type 4 is for Median Hash
   
## Make it Work for your Use Case:
* The DB is initialized with the reference hash of the reference images which is set up here: [Reference DB Images](https://github.com/iavinash73/Distributed-flagging-system/tree/main/backend/static/images)
* Upon server being activated the reference hashes are calculated, so put the reference images you want instead if you want to block a specific type of content.
* You can initialize any number of servers (This implementation we initialized 4 Servers) with varying hashes and thresholds.
* A distributed system is more trustworthy but is also slower hence give enough time in between server initializations and voting time for better efficiency **( use time.sleep() in backend for this )**.

## Setup Instructions

### Backend Setup

1. **Navigate to the `backend` directory.**
2. **Create a virtual environment:**
    ```bash
    > python3 -m venv venv
    ```
3. **Activate the virtual environment:**
    - On Windows:
        ```bash
        > venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```bash
        > source venv/bin/activate
        ```
4. **Install dependencies:**
    ```bash
    > pip install -r requirements.txt
    ```
5. **Set up the database:**
    - Modify the `config.py` file to specify your database configuration.
6. **Start the Flask server:**
    ```bash
    > flask run
    ```

### Frontend Setup

1. Navigate to the `d_flag` directory.
2. Install dependencies:
    ```bash
    > npm install
    ```
3. Start the React development server:
    ```bash
    > npm start
    ```

## Usage

- Access the frontend at `http://localhost:3000`.
- The backend APIs are available at `http://localhost:5000`.
- Hit the endpoint `http://127.0.0.1:5000/initdb` to initialise the DB with reference cat images. This will be required for the algorithms to compare hashes and vote.

## Folder Structure

- `backend`: Contains the Flask backend code.
- `d_flag`: Contains the React frontend code.

## Authors

* [Ajay Badrinath](https://github.com/AjayBadrinath)
* [Abhijith Ajith](https://github.com/AAbhijithA)
* [Avinash PR](https://github.com/iavinash73)

