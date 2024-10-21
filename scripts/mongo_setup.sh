#!/bin/bash

echo "Waiting 10 seconds for mongo to start..."

sleep 10

echo mongo_setup.sh time now: `date +"%T" `
mongosh --host mongo:27017 <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongo:27017",
        "priority": 2
      }
    ]
  };
  rs.initiate(cfg);

  db.adminCommand({ "setDefaultRWConcern" : 1 })
EOF