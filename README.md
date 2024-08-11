# Simple Pantry Tracker App - Learning Firebase and Next.js

This is a Simple Pantry Tracker App created with Next.js. The app helps you track items in your pantry. Below are the steps to set up and run the application.

## Setup Instructions

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Steps to Setup

1.  **Create the Next.js App**

    Use the following command to create a new Next.js application:

    ```bash
    npx create-next-app@latest
    ```

    When prompted, provide the following responses:

        What is your project named? pantryapp
        Would you like to use TypeScript? No
        Would you like to use ESLint? Yes
        Would you like to use Tailwind CSS? No
        Would you like to use src/ directory? No
        Would you like to use the App Router (recommended)? Yes
        Would you like to customize the default import alias? No

2.  Navigate to the Project Directory

Change into the project directory:

```bash
  cd pantryapp
```

3.  Run the Development Server

Start the development server with the following command:

```bash
  npm run dev
```

Open your browser and go to http://localhost:3000 to view the app.

4. Installing firebase

first, use this command and creating the file "firebase.js" on the project.
```bash
  npm install firebase
```

Than using this commands for firestore, no sql databse. (read more here: https://github.com/FirebaseExtended/reactfire):

```bash
  npm install --save firebase@^9.0.0 reactfire
```

```bash
  npm install --save firebase reactfire --legacy-peer-deps
```

```bash
  npm install --save firebase reactfire --force
```

your "firebase.js" should be looking like this:

```bash
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJzt_TDkjm_M5PP4Hey4FW6yxtGW_AeM4",
  authDomain: "pantryapp-f04ed.firebaseapp.com",
  projectId: "pantryapp-f04ed",
  storageBucket: "pantryapp-f04ed.appspot.com",
  messagingSenderId: "55168617045",
  appId: "1:55168617045:web:aee1715aa3644a06eea2dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };

```

On the "page.js", you should be importing this:

```bash
import { firestore } from "@/firebase";
```

Than create a collection on firestore:
![image](https://github.com/user-attachments/assets/739ba7c8-5811-4f79-a108-bebabae30b3f)

in order to use the data from firestore collection, we modified this way our "page.js" file in order to see the items from the firestore collection:

"page.js":

```bash
"use client";

import { Box, Stack, Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, "pantry"));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push(doc.id);
      });

      console.log(pantryList);
      setPantry(pantryList);
    };

    updatePantry();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Box border={"5px solid black"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"navy"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="h2" color="#f0f0f0" textAlign="center">
            Pantry Items📦
          </Typography>
        </Box>
        <Stack width="800px" height="200px" spacing={2} overflow={"scroll"}>
          {pantry.map((i) => (
            <Box
              key={i}
              width="100%"
              height="300px"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {i.charAt(0).toUpperCase() + i.slice(1)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
```

## Preview

![image](https://github.com/user-attachments/assets/f833d1de-a51a-43e8-837f-13989e7c2989)

## DEMO

![inventory](https://github.com/user-attachments/assets/b3de29cb-4301-4b5e-ab8f-e715a7f0677e)


## Second Part - Improving UI 

For improving the UI we will be using "MUI" which is Material UI by using this command to install:

```bash
yarn add @mui/material @emotion/react @emotion/styled
```

We will be able to use the module using the following import:

```bash
import { Container } from "@mui/material";
```
