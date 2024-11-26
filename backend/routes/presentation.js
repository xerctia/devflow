
// import express from 'express';
// import { Presentation } from '../models/Presentation.js';

// const router = express.Router();

// // new pres
// router.post('/', async (req, res) => {
//   try {
//     const presentation = new Presentation({
//       title: req.body.title,
//       slides: [{ slideNumber: 1, elements: [] }]
//     });
//     const savedPresentation = await presentation.save();
//     res.json(savedPresentation);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // all pres
// router.get('/', async (req, res) => {
//   try {
//     const presentations = await Presentation.find();
//     res.json(presentations);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //specific pres
// router.get('/:id', async (req, res) => {
//   try {
//     const presentation = await Presentation.findById(req.params.id);
//     if (!presentation) return res.status(404).json({ message: 'Presentation not found' });
//     res.json(presentation);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update pres
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedPresentation = await Presentation.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedPresentation);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Add/Update slide
// router.post('/:id/slides', async (req, res) => {
//   try {
//     const presentation = await Presentation.findById(req.params.id);
//     presentation.slides.push({
//       slideNumber: presentation.slides.length + 1,
//       elements: req.body.elements || []
//     });
//     const updated = await presentation.save();
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// export default router;
 
import express from 'express';
import { createPresentation, getPresentations, getPresentationById, updatePresentation, addSlide } from "../server";  

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const newPresentation = await createPresentation({
      title: req.body.title, 
      description: req.body.description || '',  
    });
    res.json(newPresentation);  
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const presentationsList = await getPresentations();
    res.json(presentationsList);  
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const presentation = await getPresentationById({ id: req.params.id });
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    res.json(presentation);  
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedPresentation = await updatePresentation({
      id: req.params.id,
      title: req.body.title,
      description: req.body.description,
    });
    res.json(updatedPresentation);  
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post('/:id/slides', async (req, res) => {
  try {
    const updatedPresentation = await addSlide({
      presentationId: req.params.id,  
      elements: req.body.elements || [],  
    });
    res.json(updatedPresentation);  
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
