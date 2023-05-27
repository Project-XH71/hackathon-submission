package com.example.gfg1;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

public class login extends AppCompatActivity {

    TextView mainlogin, forgotpass;
    EditText enterlemail, enterlpassword;
    String email,password;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        enterlemail = (EditText) findViewById(R.id.enterlemail);
        enterlpassword = (EditText) findViewById(R.id.enterlpassword);
        mainlogin = (TextView) findViewById(R.id.mainlogin);
        forgotpass = (TextView) findViewById(R.id.forgotpass);

        mainlogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(login.this, Dashboard.class);
                startActivity(i);
                userLogin();
            }

            private void userLogin() {
                email = enterlemail.getText().toString();
                password = enterlemail.getText().toString();
            }
        });

        forgotpass.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(login.this, Forgotpassword.class);
                startActivity(i);
            }
        });

        class UserLogin extends AsyncTask<Void, Void, String>
        {

            ProgressBar progressBar;

            protected void onPreExecute() {
                super.onPreExecute();
                progressBar = (ProgressBar) findViewById(R.id.progressBar);
                progressBar.setVisibility(View.VISIBLE);
            }

            protected void onPostExecute(String s) {
                super.onPostExecute(s);
                progressBar.setVisibility(View.GONE);

                try {
                    //converting response to json object
                    JSONObject obj = new JSONObject(s);

                    //if no error in response
                    if (!obj.getBoolean("error")) {
                        Toast.makeText(getApplicationContext(), obj.getString("message"), Toast.LENGTH_SHORT).show();

                        //getting the user from the response
                        JSONObject userJson = obj.getJSONObject("user");


                        //creating a new user object
                        User user = new User(
                                userJson.getString("LOGIN_ID"),
                                userJson.getString("NAME"),
                                userJson.getString("EMAIL_ID"),
                                userJson.getString("PHONE_NO"),
                                userJson.getString("PASSWORD");


                        Log.e("email", userJson.getString("EMAIL_ID"));
                        SharedPrefManager.getInstance(getApplicationContext()).userLogin(user);

                        if (userJson.getString("ROLE").equals("1")) {
                            Intent Page = new Intent(login.this, dashboard.class);
                            startActivity(Page);
                            finish();
                        } else if (userJson.getString("ROLE").equals("2")) {
                            Intent Page = new Intent(login.this, SellerDashboard.class);
                            startActivity(Page);
                            finish();
                        }

                    } else {

                        //Toast.makeText(getApplicationContext(), String.valueOf(obj.getBoolean("error")), Toast.LENGTH_SHORT).show();
                        Toast.makeText(getApplicationContext(), "Invalid username or password", Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }


            @Override
            protected String doInBackground(Void... voids) {
                return null;
            }
        }
    }
}