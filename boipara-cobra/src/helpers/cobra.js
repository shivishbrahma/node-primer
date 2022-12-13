/*
 * Cobra JS - An JSON DB Handler for Node Express Application
 * @author Purbayan Chowdhury
 */
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { get } = require("http");

exports.Cobra = function (filepath) {
    // Define filepath
    this.filepath = path.join(__dirname, filepath);

    // Initialise an empty list
    this.data = [];

    // Load data from file
    this.loadFile = function () {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filepath, { encoding: "utf8", flag: "r" }, (err, data) => {
                if (err) reject(err);
                else {
                    this.data = JSON.parse(data);
                    resolve(JSON.parse(data));
                }
            });
        });
    };

    // Return the whole list
    this.find = function () {
        return new Promise((resolve, reject) => {
            this.loadFile()
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    // Returns the list match with args values
    this.findAll = function (args) {
        return new Promise((resolve, reject) => {
            this.loadFile()
                .then((result) => {
                    let res = this.data;
                    for (i in args) {
                        res = res.filter((ele) => {
                            if (Array.isArray(args[i]) && !Array.isArray(ele[i]))
                                return ele[i].includes(args[i]);
                            return ele[i].toString() == args[i].toString();
                        });
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    // Returns only one object that matches
    this.findOne = function (args) {
        return new Promise((resolve, reject) => {
            this.findAll(args)
                .then((result) => {
                    resolve(result[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    // Save the list into json format
    this.save = function (newData) {
        return new Promise((resolve, reject) => {
            this.find()
                .then((result) => {
                    newData._id = uniqid();
                    this.data.push(newData);
                    resolve(result);
                })
                .catch((err) => reject(err));
        }).then((result) => {
            this.saveFile().then(() => {
                return "Updated Successfully!";
            });
        });
    };

    // Update the object with values by args match
    this.updateOne = function (args, newData) {
        return new Promise((resolve, reject) => {
            this.findOne({ _id: args._id })
                .then((result) => {
                    for (i in newData) {
                        result[i] = newData[i];
                    }
                    console.log(this.data);
                    resolve(result);
                })
                .catch((err) => reject(err));
        }).then((result) => {
            this.saveFile().then(() => {
                return "Updated Successfully!";
            });
        });
    };

    // Returns list after querying search in fields
    this.search = function (query, fields) {
        return new Promise((resolve, reject) => {
            this.loadFile()
                .then((result) => {
                    qlist = query.split(" ");
                    let res = result;
                    for (i in fields) {
                        res = res.filter((ele) => {
                            for (ind in qlist) {
                                if (
                                    JSON.stringify(ele[fields[i]])
                                        .toLowerCase()
                                        .indexOf(qlist[ind].toLowerCase()) != -1
                                ) {
                                    return false;
                                }
                            }
                            return true;
                        });
                    }
                    let finalList = result;
                    for (i in res) {
                        finalList = finalList.filter((ele) => {
                            return ele._id != res[i]._id;
                        });
                    }
                    resolve(finalList);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    // Delete the one that matches the args
    this.deleteOne = function (args) {
        return new Promise((resolve, reject) => {
            this.loadFile()
                .then((result) => {
                    let res = result;
                    for (i in args) {
                        res = res.filter((ele) => {
                            if (Array.isArray(args[i]) && !Array.isArray(ele[i]))
                                return ele[i].includes(args[i]);
                            return ele[i].toString() == args[i].toString();
                        });
                    }
                    this.data = result.filter((ele) => {
                        return ele._id != res[0]._id;
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        }).then((result) => {
            this.saveFile().then(() => {
                return "Deleted Successfully!";
            });
        });
    };

    // Save data into file in form of json
    this.saveFile = function () {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                this.filepath,
                JSON.stringify(this.data),
                { encoding: "utf8", flag: "w+" },
                (err) => {
                    err ? reject(err) : resolve("File Written Successfully!");
                }
            );
        });
    };

    return this;
};
