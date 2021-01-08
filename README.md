# Aninotes NodeJS

This is an API REST to manage information about artist, drawers or illustrators from
Pixiv, Devianart, Anime-pictures and Arstation, also information about Hentai content using NodeJS, Express and MySQL.


The API is divided in three parts:
- Pixiv
- Illustrators
- Sauces

Each has its own set of endpoints.

## Pixiv endpoints

```GET /api/pixiv/all```
Returns an array with all the records

**Example Response**

~~~JSON
[
   {
    "Id": 1,
    "idPixiv": "1759272",
    "pixivName": "MISOMISO",
    "Content": "fate, girls frontline, azur lane, girls",
    "Quality": "++++",
    "Favorite": "FF",
    "Link": "https://www.pixiv.net/member_illust.php?id=1759272"
  },
  {
    "Id": 2,
    "idPixiv": "261677",
    "pixivName": "InJapanese",
    "Content": "girls, fantasy",
    "Quality": "+++",
    "Favorite": "FF",
    "Link": "https://www.pixiv.net/member_illust.php?id=2616777"
  },
  {
    "Id": 3,
    "idPixiv": "1876273",
    "pixivName": "ZeN",
    "Content": "fate, vocaloid, girls, tales of berseria",
    "Quality": "++++",
    "Favorite": "FF",
    "Link": "https://www.pixiv.net/member_illust.php?id=1876273"
  }
]
~~~

```GET /api/pixiv/last```
Returns an array the last record added

```GET /api/pixiv/:id```
Returns and array with a single record using the record id or the field idPixiv

```POST /api/pixiv/add```
Adds a new record to pixiv

**Example request**

~~~JSON

POST /api/pixiv/add

{
  "idPixiv": "457541",
  "Content": "girls, jk, stockings, r",
  "pixivName": "franham",
  "Quality": "+++",
  "Favorite": "FF",
  "Link": "https://www.pixiv.net/en/users/457541"
}
~~~

All the fields must be included. Sometimes the pixivName is in japanese and the default value will be *In Japanese*.

```PUT /api/pixiv/update/:id```
Updates a record using the record id

**Example request**

~~~JSON
PUT /api/pixiv/update/3048

{
  "idPixiv": "4597765",
  "pixivName": "In Japanese",
  "Content": "hololive, fate, gabriel, girls",
  "Quality": "++++",
  "Favorite": "FF+",
  "Link": "https://www.pixiv.net/en/users/4597765"
}
~~~

All the fields must be included. If the name of the pixiv artist is not in english set the *pixivName* field to *In Japanase*

## Illustrators endpoints

Illustrators includes all the drawers and artist from Devianart, Anime-Pictures and Arstation,

```GET /api/illustrators/all```
Returns an array with all the records of illustrators

**Example response**

~~~JSON
[
   {
    "Id": 1,
    "Name": "sakimichan",
    "Source": "Devianart",
    "Content": "",
    "Comments": ""
  },
  {
    "Id": 2,
    "Name": "kawacy",
    "Source": "Devianart",
    "Content": "",
    "Comments": ""
  },
  {
    "Id": 3,
    "Name": "akizero1510",
    "Source": "Devianart",
    "Content": "",
    "Comments": ""
  }
]
~~~

```GET /api/illustrators/:id```
Returns an array with a single record using the id

```GET /api/illustrators/name/:name```
Returns an array with a single record using the name of the illustrator. The spaces must be escaped.

```GET /api/illustrators/source/:source```
Returns and array with the records that have the same values of the *Source* field.

**Example request**

~~~HTTP
GET /api/illustrators/source/Devianart
~~~

**Response** 

~~~JSON
[
   {
    "Id": 1,
    "Name": "sakimichan",
    "Source": "Devianart",
    "Content": "",
    "Comments": ""
  },
  {
    "Id": 2,
    "Name": "kawacy",
    "Source": "Devianart",
    "Content": "",
    "Comments": ""
  },
  {
    "Id": 3,
    "Name": "akizero1510",
    "Source": "Devianart",
    "Content": "",
    "Comments": ""
  }
]
~~~

```POST /api/illustrators/add```
Adds a new record to illustrators

**Example request**

~~~JSON
POST /api/illustrators/add

{
   "Name": "shexyo",
   "Source": "Devianart",
   "Content": "No text",
   "Comments": "No comment" 
}
~~~

All the fields must be included. In the fiels *Content* and *Comments* if there is not data to put the default values must be *No text* and *No comment* respectively.

```PUT /api/illustrators/update/:id```
Updates a record using the id

**Example request**

~~~JSON
PUT /api/illustrators/update/100

{
   "Name": "shexyo",
   "Source": "Devianart",
   "Content": "No text",
   "Comments": "No comment" 
}
~~~
All the fields must be included.

```DELETE /api/illustrators/delete/:id```
Deletes a record from illustrators

## Sauces endpoints

```GET /api/sauces/all```
Returns an array with all the records of Sauces.

**Example response**

~~~JSON
[
   {
    "id": 1,
    "Name": "fukuyama selfish friends",
    "Viewed": "No",
    "Description": "None",
    "Comments": "No comments",
    "Link": ""
  },
  {
    "id": 2,
    "Name": "imouto to sono yuujin ga ero sugite ore no kokan ga yabai",
    "Viewed": "No",
    "Description": "None",
    "Comments": "No comments",
    "Link": ""
  },
  {
    "id": 3,
    "Name": "kanojo ga nekomimi ni kigaetera",
    "Viewed": "No",
    "Description": "None",
    "Comments": "No comments",
    "Link": ""
  }
]
~~~

```GET /api/sauces/:id```
Returns an array with a single record

```GET /api/sauces/name/:name```
Returns an array with a single record using the name

**Example request**

~~~HTTP
GET /api/sauces/name/Yokujou
~~~

**Response**

~~~JSON
[
  {
    "id": 322,
    "Name": "Yokujou Bazooka",
    "Viewed": "No",
    "Description": "None",
    "Comments": "No comments",
    "Link": ""
  }
]
~~~

```POST /api/sauces/add```
Adds a new record to Sauces

**Example request**
~~~JSON
[
  {
    "Name": "Yokujou Bazooka",
    "Viewed": "No",
    "Description": "None",
    "Comments": "No comments",
    "Link": ""
  }
]
~~~
All the field must be included. In the fields *Viewed*, *Description* and *Comments* if there is not data to put the default values must be *No*, *None* and *No comments* respectively.


```PUT /api/sauces/update/:id```
Updates a record of Sauces

```DELETE /api/sauces/delete/:id```
Deletes a record of Sauces

## Responses

| Case  | Code  | Response Content |
|---|---|---|
| Add data | 201 | ```{"message": "Data Added Successfully"}```|
| Update data | 200 | ```{"message": "Data Updated Successfully"}```|
| No endpoint | 404 | ```{"message": "Not Found"}```|
| Missing field in POST or PUT body| 422 | ```{"message": "Fields are missing"}```|
| Server side error | 500 | ```{"message": "Server Internal Error"}```|

