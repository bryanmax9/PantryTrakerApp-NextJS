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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtered pantry items based on search term
  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2, // Ensure it's behind everything
        }}
      >
        <source src="/Kitchen.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))",
          zIndex: -1, // Overlay just above the video
        }}
      />

      <Box
        width="100%"
        minHeight="300px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
        p={4}
        sx={{ position: "relative", zIndex: 1 }} // Content above the background
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

        {/* Styled Search Input Field */}
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            bgcolor: "white",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#f0f0f0", // lighter border color
                borderWidth: "2px", // thicker border
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3f51b5", // change color on focus
              },
            },
            "& .MuiInputBase-input": {
              fontWeight: "bold", // thicker font
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold", // thicker label font
              color: "#000", // label color
            },
          }}
        />
        <Button variant="contained" onClick={handleOpen}>
          Add Item +
        </Button>

        <Box width="100%" maxWidth="800px">
          <Box
            sx={{
              background: "linear-gradient(135deg, #3a3d98, #3f51b5)",
              color: "#f0f0f0",
              p: 2,
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4">Pantry Items📦</Typography>
          </Box>

          <Stack
            sx={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(63, 81, 181, 0.5)",
              borderRadius: "0 0 12px 12px",
              backdropFilter: "blur(10px)", // Frosted glass effect
              p: 2,
              spacing: 2,
              overflow: "auto",
              maxHeight: "400px",
            }}
          >
            {filteredPantry.map(({ name, count }) => (
              <Stack
                key={name}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
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
    </Box>
  );
}
