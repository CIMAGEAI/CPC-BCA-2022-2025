package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.util.Log;

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.ArrayList;
import java.util.List;

/**
 * UserDatabaseHelper.java
 * This class manages the SQLite database for the application.
 * It handles creating tables for users and blood requests, and provides
 * methods for inserting, retrieving, and updating user and blood request data.
 */
public class UserDatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "user_db";
    private static final int DATABASE_VERSION = 2; // Increased version for upgrade

    // Users Table
    public static final String TABLE_USERS = "users";
    public static final String COLUMN_ID = "id";
    public static final String COLUMN_EMAIL = "email";
    public static final String COLUMN_PHONE = "phone";
    public static final String COLUMN_BLOOD_GROUP = "blood_group";
    public static final String COLUMN_PASSWORD = "password";
    public static final String COLUMN_LATITUDE = "latitude";
    public static final String COLUMN_LONGITUDE = "longitude";
    public static final String COLUMN_CITY = "city";

    // Blood Requests Table
    public static final String TABLE_BLOOD_REQUESTS = "blood_requests";
    public static final String COLUMN_REQ_ID = "id";
    public static final String COLUMN_REQ_NAME = "name";
    public static final String COLUMN_REQ_PHONE = "phone";
    public static final String COLUMN_REQ_BLOOD_GROUP = "blood_group";
    public static final String COLUMN_REQ_CITY = "city";
    public static final String COLUMN_REQ_REASON = "reason";


    private Context context;

    public UserDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        this.context = context;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        // Create Users table
        String CREATE_USERS_TABLE = "CREATE TABLE " + TABLE_USERS + "("
                + COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + COLUMN_EMAIL + " TEXT UNIQUE,"
                + COLUMN_PHONE + " TEXT UNIQUE,"
                + COLUMN_BLOOD_GROUP + " TEXT,"
                + COLUMN_PASSWORD + " TEXT,"
                + COLUMN_LATITUDE + " REAL DEFAULT 0.0," // Added latitude with default
                + COLUMN_LONGITUDE + " REAL DEFAULT 0.0," // Added longitude with default
                + COLUMN_CITY + " TEXT" // Added city
                + ")";
        db.execSQL(CREATE_USERS_TABLE);

        // Create Blood Requests table
        String CREATE_BLOOD_REQUESTS_TABLE = "CREATE TABLE " + TABLE_BLOOD_REQUESTS + "("
                + COLUMN_REQ_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + COLUMN_REQ_NAME + " TEXT,"
                + COLUMN_REQ_PHONE + " TEXT,"
                + COLUMN_REQ_BLOOD_GROUP + " TEXT,"
                + COLUMN_REQ_CITY + " TEXT,"
                + COLUMN_REQ_REASON + " TEXT"
                + ")";
        db.execSQL(CREATE_BLOOD_REQUESTS_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // Drop older tables if they exist and recreate them
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USERS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_BLOOD_REQUESTS);
        onCreate(db);
    }

    /**
     * Inserts a new user into the database.
     * @param email The user's email.
     * @param phone The user's phone number.
     * @param bloodGroup The user's blood group.
     * @param password The user's password.
     * @param city The user's city.
     * @return True if insertion is successful, false otherwise.
     */
    public boolean insertUser(String email, String phone, String bloodGroup, String password, String city) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_EMAIL, email);
        contentValues.put(COLUMN_PHONE, phone);
        contentValues.put(COLUMN_BLOOD_GROUP, bloodGroup);
        contentValues.put(COLUMN_PASSWORD, password);
        contentValues.put(COLUMN_CITY, city); // Add city

        long result = db.insert(TABLE_USERS, null, contentValues);
        db.close();
        return result != -1; // Return true if insert was successful
    }

    /**
     * Checks if a user with the given email or phone already exists.
     * @param email The email to check.
     * @param phone The phone to check.
     * @return True if user exists, false otherwise.
     */
    public boolean isUserExists(String email, String phone) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_USERS + " WHERE " + COLUMN_EMAIL + "=? OR " + COLUMN_PHONE + "=?", new String[]{email, phone});
        boolean exists = cursor.getCount() > 0;
        cursor.close();
        db.close();
        return exists;
    }

    /**
     * Checks user credentials for login.
     * @param phone The user's phone number.
     * @param password The user's password.
     * @return True if credentials are valid, false otherwise.
     */
    public boolean checkUserCredentials(String phone, String password) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT password FROM users WHERE phone = ?", new String[]{phone});

        if (cursor != null && cursor.moveToFirst()) {
            String storedPassword = cursor.getString(0);

            Log.d("DB_CHECK", "Phone: " + phone + " | Stored: " + storedPassword + " | Entered: " + password);

            cursor.close();
            return storedPassword.equals(password);
        }

        if (cursor != null) {
            cursor.close();
        }

        return false;
    }

    /**
     * Retrieves a user's details by their phone number.
     * @param phone The phone number of the user.
     * @return UserModel object if found, null otherwise.
     */
    public UserModel getUserByPhone(String phone) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_USERS + " WHERE " + COLUMN_PHONE + "=?", new String[]{phone});
         UserModel user = null;
        if (cursor.moveToFirst()) {
            @SuppressLint("Range") String email = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_EMAIL));
            @SuppressLint("Range") String bloodGroup = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_BLOOD_GROUP));
            @SuppressLint("Range") String city = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_CITY));
            user = new UserModel(email, phone, bloodGroup, city);
        }
        cursor.close();
        db.close();
        return user;
    }

    /**
     * Retrieves a user's ID by their phone number.
     * @param phone The phone number of the user.
     * @return The user's ID, or -1 if not found.
     */
    public int getUserIdByPhone(String phone) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT " + COLUMN_ID + " FROM " + TABLE_USERS + " WHERE " + COLUMN_PHONE + "=?", new String[]{phone});
        int userId = -1;
        if (cursor.moveToFirst()) {
            @SuppressLint("Range") int id = cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_ID));
            userId = id;
        }
        cursor.close();
        db.close();
        return userId;
    }

    /**
     * Retrieves a user's city by their phone number.
     * @param phone The phone number of the user.
     * @return The user's city, or null if not found.
     */
    public String getCityByPhone(String phone) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT " + COLUMN_CITY + " FROM " + TABLE_USERS + " WHERE " + COLUMN_PHONE + "=?", new String[]{phone});
        String city = null;
        if (cursor.moveToFirst()) {
            @SuppressLint("Range") String c = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_CITY));
            city = c;
        }
        cursor.close();
        db.close();
        return city;
    }

    /**
     * Updates user profile information.
     * @param oldPhone The original phone number (used to identify the user).
     * @param newEmail The new email.
     * @param newPhone The new phone number.
     * @param newBloodGroup The new blood group.
     * @param newCity The new city.
     * @return True if update is successful, false otherwise.
     */
    public boolean updateUserProfile(String oldPhone, String newEmail, String newPhone, String newBloodGroup, String newCity) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_EMAIL, newEmail);
        contentValues.put(COLUMN_PHONE, newPhone);
        contentValues.put(COLUMN_BLOOD_GROUP, newBloodGroup);
        contentValues.put(COLUMN_CITY, newCity);

        int result = db.update(TABLE_USERS, contentValues, COLUMN_PHONE + " = ?", new String[]{oldPhone});
        db.close();
        return result > 0;
    }

    /**
     * Updates user's location (latitude, longitude) and city.
     * @param userId The ID of the user to update.
     * @param latitude The new latitude.
     * @param longitude The new longitude.
     * @param city The new city (can be null if only updating coordinates).
     * @return True if update is successful, false otherwise.
     */
    public boolean updateUserLocation(int userId, double latitude, double longitude, String city) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_LATITUDE, latitude);
        contentValues.put(COLUMN_LONGITUDE, longitude);
        if (city != null) {
            contentValues.put(COLUMN_CITY, city);
        }

        int result = db.update(TABLE_USERS, contentValues, COLUMN_ID + " = ?", new String[]{String.valueOf(userId)});
        db.close();
        return result > 0;
    }

    /**
     * Retrieves a list of donors based on city and blood group.
     * @param city The city to filter by.
     * @param bloodGroup The blood group to filter by.
     * @return A list of UserModel objects matching the criteria.
     */
    public List<UserModel> getDonorsByCityAndBlood(String city, String bloodGroup) {
        List<UserModel> list = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_USERS + " WHERE " + COLUMN_CITY + "=? AND " + COLUMN_BLOOD_GROUP + "=?", new String[]{city, bloodGroup});

        if (cursor.moveToFirst()) {
            do {
                @SuppressLint("Range") String email = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_EMAIL));
                @SuppressLint("Range") String phone = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_PHONE));
                @SuppressLint("Range") String bGroup = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_BLOOD_GROUP));
                @SuppressLint("Range") String c = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_CITY));
                list.add(new UserModel(email, phone, bGroup, c));
            } while (cursor.moveToNext());
        }
        cursor.close();
        db.close();
        return list;
    }


    public boolean insertBloodRequest(String name, String phone, String bloodGroup, String city, String reason) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_REQ_NAME, name);
        contentValues.put(COLUMN_REQ_PHONE, phone);
        contentValues.put(COLUMN_REQ_BLOOD_GROUP, bloodGroup);
        contentValues.put(COLUMN_REQ_CITY, city);
        contentValues.put(COLUMN_REQ_REASON, reason);

        long result = db.insert(TABLE_BLOOD_REQUESTS, null, contentValues);
        db.close();
        return result != -1;
    }

    /**
     * Retrieves all blood requests from the database.
     * @return A list of BloodRequestModel objects.
     */
    public List<BloodRequestModel> getAllRequests() {
        List<BloodRequestModel> list = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_BLOOD_REQUESTS, null);
        if (cursor.moveToFirst()) {
            do {
                @SuppressLint("Range") String name = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_NAME));
                @SuppressLint("Range") String bloodGroup = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_BLOOD_GROUP));
                @SuppressLint("Range") String phone = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_PHONE));
                @SuppressLint("Range") String city = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_CITY));
                @SuppressLint("Range") String reason = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_REASON));

                list.add(new BloodRequestModel(name, phone, bloodGroup, city, reason));
            } while (cursor.moveToNext());
        }
        cursor.close();
        db.close();
        return list;
    }

    /**
     * Get blood requests filtered by blood group.
     * @param bloodGroup The blood group to filter by.
     * @return A list of BloodRequestModel objects matching the blood group.
     */
    public List<BloodRequestModel> getRequestsByBloodGroup(String bloodGroup) {
        List<BloodRequestModel> list = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_BLOOD_REQUESTS + " WHERE " + COLUMN_REQ_BLOOD_GROUP + "=?", new String[]{bloodGroup});
        if (cursor.moveToFirst()) {
            do {
                @SuppressLint("Range") String name = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_NAME));
                @SuppressLint("Range") String bGroup = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_BLOOD_GROUP));
                @SuppressLint("Range") String phone = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_PHONE));
                @SuppressLint("Range") String city = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_CITY));
                @SuppressLint("Range") String reason = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_REQ_REASON));

                list.add(new BloodRequestModel(name, phone, bGroup, city, reason));
            } while (cursor.moveToNext());
        }
        cursor.close();
        db.close();
        return list;
    }

    /**
     * Get currently logged in user's blood group.
     * @return The blood group of the logged-in user, or null if not found.
     */
    public String getCurrentUserBloodGroup() {
        SharedPreferences preferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE);
        String phone = preferences.getString("user_phone", null);
        if (phone == null) return null;
        return getBloodGroupByPhone(phone);
    }

    /**
     * Retrieves the blood group of a user by their phone number.
     * @param phone The phone number of the user.
     * @return The user's blood group, or null if not found.
     */
    public String getBloodGroupByPhone(String phone) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT " + COLUMN_BLOOD_GROUP + " FROM " + TABLE_USERS + " WHERE " + COLUMN_PHONE + "=?", new String[]{phone});
        String bloodGroup = null;
        if (cursor.moveToFirst()) {
            @SuppressLint("Range") String bg = cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_BLOOD_GROUP));
            bloodGroup = bg;
        }
        cursor.close();
        db.close();
        return bloodGroup;
    }
}
