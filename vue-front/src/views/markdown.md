# Reference
  
# Group M1 Spatial Player API

That is a first draft of m1 api, at this moment we are have a api for control playing sound file [based on dash stream]

## Tracks Collection [/tracks]

### List All Track [GET /tracks]

This GET methods have public access, but number of tracks depends on the user auth and user role; all other methods able only for admin user role

+ Response 200 (application/json)

    + Attributes (array)
        + (object)
            + id (string, required) - track  id
            + name (string, required) - track name 
            + originalname (string, required) - track original file name 
            + size (number, required) - file size in bytes
            + mimetype (string, required) - filre mimetype
            + prepared (boolean, required) - set in true if track has prepared dash manifest
            + created (string, required) - timestamp with creation date in the ISO format
            + updated (string, required) - timestamp with last update date in the ISO format

    + Body

        ```
        [
            {
                "id": "d8b68448-d7ae-413a-89bf-308ed9c7ef46",
                "name": "m1-debug-shrtpt-m1spatial.wav",
                "originalname": "m1-debug-shrtpt-m1spatial.wav",
                "size": 12701536,
                "mimetype": "audio/wav",
                "prepared": true,
                "created": "2021-10-05T19:45:52.756+03:00",
                "updated": "2021-10-05T19:45:52.689+03:00"
            },
            {
                "id": "6d0e43df-d826-48f9-b4ff-1215f9ea2a7e",
                "name": "m1-debug-visual.wav",
                "originalname": "m1-debug-visual.wav",
                "size": 6880336,
                "mimetype": "audio/wav",
                "prepared": false,
                "created": "2021-10-05T19:45:52.756+03:00",
                "updated": "2021-10-05T19:45:52.756+03:00"
            },
            {
                "id": "82a2ec62-8c56-41e4-a036-cd1d16ee1633",
                "name": "test.wav",
                "originalname": "test.wav",
                "size": 23543824,
                "mimetype": "audio/wav",
                "prepared": false,
                "created": "2021-10-05T19:45:52.758+03:00",
                "updated": "2021-10-05T19:45:52.756+03:00"
            }
        ]
        ```

### Start a play sound track [GET /tracks/{id}]

This hook used for start preapre mainifest for track

+ Parameters
    + id (string, required) - track id 
    
+ Response 204 (application/json)

### Dash manifest file [GET /dash/static/{id}/manifest.mpd]

That is the main resource for playing any our sound files, used standart dash stream mainifest file, documentation for [dash.js](https://cdn.dashjs.org/latest/jsdoc/module-MediaPlayer.html)

+ Parameters
    + id (string, required) - track id 

+ Response 200 (application/dash+xml)
    
    + Body

        ```
        <?xml version="1.0" encoding="utf-8"?>
        <MPD xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd" profiles="urn:mpeg:dash:profile:isoff-live:2011" type="static" mediaPresentationDuration="PT12.0S" maxSegmentDuration="PT5.0S" minBufferTime="PT10.0S">
            <ProgramInformation></ProgramInformation>
            <ServiceDescription id="0"></ServiceDescription>
            <Period id="0" start="PT0.0S">
                <AdaptationSet id="0" contentType="audio" startWithSAP="1" segmentAlignment="true" bitstreamSwitching="true">
                    <Representation id="0" mimeType="audio/webm" codecs="opus" bandwidth="2048000" audioSamplingRate="48000">
                        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="8" />
                        <SegmentTemplate timescale="1000" initialization="init-stream$RepresentationID$.webm" media="chunk-stream$RepresentationID$-$Number%05d$.webm" startNumber="1">
                            <SegmentTimeline>
                                <S t="0" d="5001" />
                                <S d="5000" />
                                <S d="2007" />
                            </SegmentTimeline>
                        </SegmentTemplate>
                    </Representation>
                </AdaptationSet>
            </Period>
        </MPD>
        ```

### Upload a New Track [POST /upload]

Dashboard administrator has ability to upload new track to the backend, can be attached more then one files

+ Request (multipart/form-data)

        [
            {
                "file": "binary"
            }
        ]

+ Response 201 (application/json)

  + Attributes (object)
        + id (string, required) - track  id
        + name (string, required) - track name 
        + originalname (string, required) - track original file name 
        + size (number, required) - file size in bytes
        + mimetype (string, required) - filre mimetype
        + prepared (boolean, required) - set in true if track has prepared dash manifest
        + created (string, required) - timestamp with creation date in the ISO format
        + updated (string, required) - timestamp with last update date in the ISO format

    + Body

        ```
        [
            {
                "id": "82a2ec62-8c56-41e4-a036-cd1d16ee1633",
                "name": "test.wav",
                "originalname": "test.wav",
                "size": 23543824,
                "mimetype": "audio/wav",
                "prepared": false,
                "created": "2021-10-05T19:45:52.758+03:00",
                "updated": "2021-10-05T19:45:52.756+03:00"
            }
        ]
        ```

### Delete Track [DELETE /tracks/{id}]

+ Parameters
    + id (string, required) - track id 
    
+ Response 204 (application/json)

## User authorization and authentication [/auth]

Users are authenticated using the generated and stored keys in the cookie. For each unique visitor, a separate key is generated (regardless of whether the user was authorized or not), which will be transmitted in the response header during any first request from the user. During authorization, a user session is created that will be identified with this key

### Login [POST /auth] 

+ Request (application/json)

    + Attributes (object)
        + login (string, required) - user nickname or email
        + password (string, required) - user password

    + Body

        ```
        {
            "login": "test",
            "password": "test"
        }
        ```
+ Response 201 (application/json)

    + Attributes (object)
        + user (object, required)
            + id (string, required) - user  id
            + nickname (string, required) - user nickname (can be used as login)
            + email (string, required) - user email (can be used as login)
            + role (string, required) - one of two type of user roles: "user" or "admin"
            + lastSeen (string) - timestamp with last user auth date in the ISO format (optional and can be empty)
            + created (string, required) - timestamp with creation date in the ISO format
            + updated (string, required) - timestamp with last update date in the ISO format
            

    + Body

        ```
        {
            "user": {
                "id": "ca360e68-8b2d-4cbb-b389-cbcc4a0d986a",
                "nickname": "m1",
                "email": "support@mach1.tech",
                "role": "admin,
                "lastSeen": "",
                "created": "2021-10-05T21:35:55.425+03:00",
                "updated": "2021-10-05T21:35:55.425+03:00"
            }
        }
        ```

### Logout [DELETE /auth/logout]

+ Response 204 (application/json)

    Removing user sessions


    + Body
    
    
## Playlist collection [/playlists]

The dashboard administrator has the ability to create, update or delete any playlist. At the same time, both authorized and not authorized users have a chance to get a list of playlists with available tracks information (track id)

### List All Playlists [GET /playlists]

+ Response 200 (application/json)

    + Attributes (array)
        + (object)
          + id (string, required) - playlist  id
          + name (string, required) - playlist name
          + tracks (array) - array with attached tracks id (available only for admins)
          + permissions (array) - array with attached users id (available only for admins)
          + visibility (boolean, required) - value to present has this playlist public visibility or not
          + created (string, required) - timestamp with creation date in the ISO format
          + updated (string, required) - timestamp with last update date in the ISO format
   
    + Body

        ```
        [
            {
                "id": "c69fd5ec-e6bd-4e48-b2f9-a45d84099d2e",
                "name": "The Awesome Playlist",
                "tracks": ["d8b68448-d7ae-413a-89bf-308ed9c7ef46"],
                "permissions": [],
                "visibility": false,
                "created": "2021-10-05T21:35:55.425+03:00",
                "updated": "2021-10-05T21:35:55.425+03:00"
            }
        ]
        ```

### Create a New Playlist [POST /playlists]

+ Request (application/json)

    + Attributes (object)
        + name (string, required) - playlist name

    + Body

        ```
        {
            "name": "The Awesome Playlist"
        }
        ```

+ Response 201 (application/json)

    + Attributes (object)
        + id (string, required) - playlist  id
        + name (string, required) - playlist name
        + tracks (array) - array with attached tracks id (available only for admins)
        + permissions (array) - array with attached users id (available only for admins)
        + visibility (boolean, required) - value to present has this playlist public visibility or not
        + created (string, required) - timestamp with creation date in the ISO format
        + updated (string, required) - timestamp with last update date in the ISO format

    + Body

        ```
        {
            "id": "c69fd5ec-e6bd-4e48-b2f9-a45d84099d2e",
            "name": "The Awesome Playlist",
            "tracks": [],
            "permissions": [],
            "visibility": false,
            "created": "2021-10-05T21:35:55.425+03:00",
            "updated": "2021-10-05T21:35:55.425+03:00"
        }
        ```

### Update Playlist [PUT /playlists/{id}]

+ Parameters
    + id (string, required) - playlist id 

+ Request (application/json)

    + Attributes (object)
        + name (string) - playlist name
        + tracks (array) - array with attached tracks id
        + permissions (array) - array with attached users id
        + visibility (boolean) - value to present has this playlist public visibility or not

    + Body

        ```
        {
            "tracks": ["1db814ff-263f-4e92-9865-4701a9efeac1"]
        }
        ```
            
+ Response 200 (application/json)

    + Attributes (object)
        + id (string, required) - playlist  id
        + name (string, required) - playlist name
        + tracks (array) - array with attached tracks id (available only for admins)
        + permissions (array) - array with attached users id (available only for admins)
        + visibility (boolean, required) - value to present has this playlist public visibility or not
        + created (string, required) - timestamp with creation date in the ISO format
        + updated (string, required) - timestamp with last update date in the ISO format

    + Body

        ```
        {
            "id": "c69fd5ec-e6bd-4e48-b2f9-a45d84099d2e",
            "name": "The Awesome Playlist",
            "tracks": ["1db814ff-263f-4e92-9865-4701a9efeac1"],
            "permissions": [],
            "visibility": false,
            "created": "2021-10-05T21:35:55.425+03:00",
            "updated": "2021-10-05T21:35:55.425+03:00"
        }
        ```

### Delete Playlist [DELETE /playlists/{id}]

+ Parameters
    + id (string, required) - playlist id 
    
+ Response 204 (application/json)


## User collection [/users]

### List All Users [GET /users]

+ Response 200 (application/json)

    + Attributes (array)
        + (object)
          + id (string, required) - user  id
          + nickname (string, required) - user nickname (can be used as login)
          + email (string, required) - user email (can be used as login)
          + role (string, required) - one of two type of user roles: "user" or "admin"
          + lastSeen (string) - timestamp with last user auth date in the ISO format (optional and can be empty)
          + created (string, required) - timestamp with creation date in the ISO format
          + updated (string, required) - timestamp with last update date in the ISO format

   
    + Body

        ```
        [
            {
                "id": "ca360e68-8b2d-4cbb-b389-cbcc4a0d986a",
                "nickname": "m1",
                "email": "support@mach1.tech",
                "role": "admin,
                "lastSeen": "",
                "created": "2021-10-05T21:35:55.425+03:00",
                "updated": "2021-10-05T21:35:55.425+03:00"
            }
        ]
        ```

### Create a New User [POST /users]

+ Request (application/json)

    + Attributes (object)
        + nickname (string, required) - user nickname
        + email (string, required) - user email
        + role (string, required) - one of two type of user roles: "user" or "admin"
        + password (string, required) - user password, min length = 8

    + Body
        
        ```
        {
            "nickname": "m1",
            "email": "support@mach1.tech",
            "role": "admin,
            "password": "some_new_user_password"
        }
        ```

+ Response 201 (application/json)

    + Attributes (object)
        + id (string, required) - user  id
        + nickname (string, required) - user nickname (can be used as login)
        + email (string, required) - user email (can be used as login)
        + role (string, required) - one of two type of user roles: "user" or "admin"
        + lastSeen (string) - timestamp with last user auth date in the ISO format (optional and can be empty)
        + created (string, required) - timestamp with creation date in the ISO format
        + updated (string, required) - timestamp with last update date in the ISO format

    + Body

        ```
        {
            "id": "ca360e68-8b2d-4cbb-b389-cbcc4a0d986a",
            "nickname": "m1",
            "email": "support@mach1.tech",
            "role": "admin,
            "lastSeen": "",
            "created": "2021-10-05T21:35:55.425+03:00",
            "updated": "2021-10-05T21:35:55.425+03:00"
        }
        ```

### Update User [PUT /users/{id}]

+ Response 405 (application/json)
            
### Delete User [DELETE /users/{id}]

+ Parameters
    + id (string, required) - user id 
    
+ Response 204 (application/json)

## User profile collection [/profile]

This resource is used for getting current user information by self and updating available profile information, for example, password

### Get User profile infomration [GET /profile]

Checking and returning current user session: if exist return 200 else empty body and 204; Removing session object if a session was corrupted or expired

+ Response 200 (application/json)

    + Attributes (object)
        + user (object, required)
            + id (string, required) - user  id
            + nickname (string, required) - user nickname (can be used as login)
            + email (string, required) - user email (can be used as login)
            + role (string, required) - one of two type of user roles: "user" or "admin"
            + lastSeen (string) - timestamp with last user auth date in the ISO format (optional and can be empty)
            + created (string, required) - timestamp with creation date in the ISO format
            + updated (string, required) - timestamp with last update date in the ISO format
            

    + Body

        ```
        {
            "user": {
                "id": "ca360e68-8b2d-4cbb-b389-cbcc4a0d986a",
                "nickname": "m1",
                "email": "support@mach1.tech",
                "role": "admin,
                "lastSeen": "",
                "created": "2021-10-05T21:35:55.425+03:00",
                "updated": "2021-10-05T21:35:55.425+03:00"
            }
        }
        ```

+ Response 204 (application/json)

    if the user is not authorized and session is empty
    
    + Body
        
+ Response 403 (application/json)

    Response can return 4** error if a session was corrupted or expired with json body and error messages

    + Body 

        ```
        {
            "message": "error message"
        }
        ```   