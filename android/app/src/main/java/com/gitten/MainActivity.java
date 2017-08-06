package com.gitten;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Point;
import android.view.Display;
import android.view.Gravity;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {
    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        TextView textView = new TextView(this);
        ImageView imageView = new ImageView(this);

        view.setBackgroundColor(Color.parseColor("#ffffff"));
        view.setGravity(Gravity.CENTER);

//        view.addView(textView);
//        Log.e("TAG", R.drawable.splash+"");

        ImageView iv = new ImageView(this);
        Bitmap orgImage = BitmapFactory.decodeResource(getResources(), R.drawable.splash);
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;
        Bitmap resize = Bitmap.createScaledBitmap(orgImage, width, height, true);
        iv.setImageBitmap(resize);

//        imageView.setImageResource(R.drawable.splash);
//        imageView.setLayoutParams(new LinearLayout.LayoutParams(300, 300));
//        imageView.setMaxWidth(300);
//        imageView.setMaxHeight(300);

        view.addView(iv);
        return view;
    }
}

