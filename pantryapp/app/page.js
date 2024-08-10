"use client";

import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = docs.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const normalizeItemName = (item) => item.trim().toLowerCase();

  const addItem = async (item) => {
    const normalizedItem = normalizeItemName(item);
    if (!normalizedItem) return;

    const docRef = doc(collection(firestore, "pantry"), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const normalizedItem = normalizeItemName(item);
    const docRef = doc(collection(firestore, "pantry"), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count <= 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updatePantry();
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box
      width="100%"
      minHeight="300px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      p={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            📦📝 Add New Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add Item
      </Button>

      <Box width="100%" maxWidth="800px">
        <Box
          bgcolor="navy"
          color="#f0f0f0"
          p={2}
          borderRadius="4px 4px 0 0"
          display="flex"
          justifyContent="center"
        >
          <Typography variant="h4">Pantry Items📦</Typography>
        </Box>

        <Stack
          bgcolor="white"
          border="2px solid navy"
          borderRadius="0 0 4px 4px"
          p={2}
          spacing={2}
          overflow="auto"
          maxHeight="400px"
        >
          {pantry.map(({ name, count }) => (
            <Stack
              key={name}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flex={1} display="flex" flexDirection="column">
                <Typography variant="h5">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1">Quantity: {count}</Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeItem(name)}
              >
                🗑️ Remove
              </Button>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
