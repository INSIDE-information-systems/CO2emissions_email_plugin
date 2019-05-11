var afbDb = {};

afbDb.init = function () {
    Components.utils.import("resource://gre/modules/Services.jsm");
    Components.utils.import("resource://gre/modules/FileUtils.jsm");

    var file = FileUtils.getFile("ProfD", ["afb.sqlite"]);
    var dbConn = Services.storage.openDatabase(file);

    return dbConn;
};

afbDb.createTable = function () {
    var dbConn = afbDb.init();
    dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS afb_storage (id INTEGER PRIMARY KEY, size INTEGER, senddate TEXT);");
}

afbDb.add = function (size) {
    var dbConn = afbDb.init();
    dbConn.executeSimpleSQL("INSERT INTO afb_storage (size, senddate) VALUES(" + size + ", date('now', 'localtime') );");
}

afbDb.getAll = function () {
    var dbConn = afbDb.init();
    return dbConn.createStatement("SELECT (\
        SELECT SUM(size)\
            FROM afb_storage\
                WHERE senddate >= date(DATETIME('now'), '-1 day') AND senddate < DATETIME('now')\
    ) AS sizeday, (\
        SELECT SUM(size)\
            FROM afb_storage\
                WHERE senddate >= date(DATETIME('now'), '-7 day') AND senddate < DATETIME('now')\
    ) AS sizeweek, (\
        SELECT SUM(size)\
            FROM afb_storage\
                WHERE senddate >= date(DATETIME('now'), '-1 month') AND senddate < DATETIME('now')\
    ) AS sizemonth, (\
        SELECT SUM(size)\
            FROM afb_storage\
                WHERE senddate >= date(DATETIME('now'), '-1 year') AND senddate < DATETIME('now')\
    ) AS sizeyear\
    FROM afb_storage\
    LIMIT 1;");
}


afbDb.getInterval = function (period) {
    var dbConn = afbDb.init();
    switch (period) {
        case 'day':
            return dbConn.createStatement("SELECT SUM(size) as size FROM afb_storage WHERE senddate >= date(DATETIME('now'), '-1 day') AND senddate < DATETIME('now')");
        case 'week':
            return dbConn.createStatement("SELECT SUM(size) as size FROM afb_storage WHERE senddate >= date(DATETIME('now'), '-7 day') AND senddate < DATETIME('now')");
        case 'month':
            return dbConn.createStatement("SELECT SUM(size) as size FROM afb_storage WHERE senddate >= date(DATETIME('now'), '-1 month') AND senddate < DATETIME('now')");
        case 'year':
            return dbConn.createStatement("SELECT SUM(size) as size FROM afb_storage WHERE senddate >= date(DATETIME('now'), '-1 year') AND senddate < DATETIME('now')");
    }
}