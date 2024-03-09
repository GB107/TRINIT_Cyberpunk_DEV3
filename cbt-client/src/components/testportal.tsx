import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// import Textarea from '@mui/joy/Textarea';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Textarea from '@mui/joy/Textarea';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import Latex from 'react-latex-next';
import LinearProgress from '@mui/material/LinearProgress';


function LinearIndeterminate() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}

enum InputMethod {
  MANUAL = 'manual',
  PDF = 'pdf',
}

interface Question {
  question: string;
  options: string[];
  image: File | null; // Image file
  isImage: boolean; // Indicates whether an image has been added
  correctAnswer: string; // Correct answer for the question
}

interface Section {
  name: string;
  marks: number;
  schema: string;
  questionType: string;
  questions: Question[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TestPage: React.FC = () => {
  const [selectedInputMethod, setSelectedInputMethod] = useState<InputMethod>(
    InputMethod.PDF
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [manualInstructions, setManualInstructions] = useState<string>('');
  const [pdfInstructions, setPdfInstructions] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        name: `Section ${sections.length + 1}`,
        marks: 0,
        schema: '',
        questionType: '',
        questions: [],
      },
    ]);
  };

  //   const manualdata =  [
  //     {
  //         "q": "A uniform rod AB of length 2L is maintained at a temperature difference of 120\u00b0C. A bent rod PQ of the same cross-section and length 2 is connected across AB. The temperature difference between P and Q in the steady state is close to:",
  //         "o1": "45\u00b0C",
  //         "o2": "60\u00b0C",
  //         "o3": "75\u00b0C",
  //         "o4": "35\u00b0C"
  //     },
  //     {
  //         "q": "Two identical beakers A and B contain equal volumes of two different liquids at 60\u00b0C each and are left to cool down. The liquid in A has a density of 8 x 10^2 kg/m^3 and a specific heat of 2000 J kg^-1 K^-1, while the liquid in B has a density of 10^3 kg m^-3 and a specific heat of 4000 J kg^-1 K^-1. Which of the following graphs schematically shows the temperature difference between the two beakers as a function of time?",
  //         "o1": "",
  //         "o2": "",
  //         "o3": "",
  //         "o4": ""
  //     },
  //     {
  //         "q": "A heat source at T = 10^3 K is connected to another heat reservoir at T = 10^2 K by a copper slab which is 1 m thick. Given that the thermal conductivity of copper is 0.1 WK^-1 m^-1, the energy flux through it in the steady state is:",
  //         "o1": "90 Wm^-2",
  //         "o2": "65 Wm^-2",
  //         "o3": "120 Wm^-2",
  //         "o4": "200 Wm^-2"
  //     },
  //     {
  //         "q": "Two materials having coefficients of thermal conductivity 3K and K, and thickness d and 3d, respectively, are joined to form a slab as shown in the figure. The temperatures of the outer surfaces are 01 and 02, respectively, with 02 > 01. The temperature at the interface is:",
  //         "o1": "$\\frac{01+02}{2}$",
  //         "o2": "$\\frac{2 \\times 01 + 3 \\times 02}{5}$",
  //         "o3": "$\\frac{3 \\times 01 + 2 \\times 02}{5}$",
  //         "o4": "$\\frac{01+02}{3}$"
  //     },
  //     {
  //         "q": "A cylinder of radius R is surrounded by a cylindrical shell of inner radius R and outer radius 2R. The thermal conductivity of the material of the inner cylinder is K1 and that of the outer cylinder is K2. Assuming no loss of heat, the effective thermal conductivity of the system for heat flowing along the length of the cylinder is:",
  //         "o1": "K1 + K2",
  //         "o2": "2K1 + 3K2",
  //         "o3": "K1 + 3K2",
  //         "o4": "4(K1 + K2)"
  //     }
  // ]

  const handleInputChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].question = value;
    setSections(newSections);
  };

  const handleOptionChange = (
    sectionIndex: number,
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].options[
      optionIndex
    ] = value;
    setSections(newSections);
  };

  const handleImageChange = (
    sectionIndex: number,
    questionIndex: number,
    image: File | null
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].image = image;
    newSections[sectionIndex].questions[questionIndex].isImage = !!image;
    setSections(newSections);
  };

  const handleCorrectAnswerChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].correctAnswer = value;
    setSections(newSections);
  };

  const handleManualSubmit = () => {
    console.log('Manual Instructions:', manualInstructions);
    console.log('Manual Answers:', sections);
  };

  const handlePDFSubmit = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      setLoader(true);
      
      const response = await axios.post('https://229a-34-125-132-139.ngrok-free.app/OCR', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      console.log('OCR Processed:', response.data);

      const manualdata = JSON.parse(response.data)

      setLoader(false);


      const sectionData = {
        name: `Section 1`,  
        marks: 0,
        schema: '',
        questionType: '',
        questions: manualdata.map((data) => ({
          question: data.q,
          options: [data.o1, data.o2, data.o3, data.o4],
          image: null,
          isImage: false,
          correctAnswer: '',
        })),
      };

      setSections([sectionData]);

      setSelectedInputMethod(InputMethod.MANUAL);

    } catch (error) {
      console.error('Error processing OCR:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      question: '',
      options: ['', '', '', ''],
      image: null,
      isImage: false,
      correctAnswer: '', // Initialize correct answer as empty string
    });
    setSections(newSections);
  };

  const handleDeleteQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(newSections);
  };

  const handlePreview = () => {
    console.log('Previewing...');
    // Add preview logic here
  };

  const boxWidth = `${sections.length * 200 + 1000}px`;

  return (
    <Box
      width={boxWidth}
      mx="auto"
      p={4}
      border="0.5px solid #ccc"
      borderRadius={4}
      bgcolor="#f7f7f7"
      color="#000"
      mt={4}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Create Test</h1>
      </div>
      <Box mb={2}>
        <RadioGroup
          aria-label="inputMethod"
          defaultValue={InputMethod.PDF}
          value={selectedInputMethod}
          onChange={(e) =>
            setSelectedInputMethod(e.target.value as InputMethod)
          }
          row
        >
          <FormControlLabel
            value={InputMethod.MANUAL}
            control={<Radio />}
            label="Upload"
          />
          <FormControlLabel
            value={InputMethod.PDF}
            control={<Radio />}
            label="Upload PDF"
          />
        </RadioGroup>
      </Box>
      {selectedInputMethod === InputMethod.MANUAL && (
        <>
          <Textarea
            placeholder="Add instructions for manual input here..."
            value={manualInstructions}
            onChange={(e) => setManualInstructions(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <Tabs
            value={currentSection}
            onChange={(e, newValue) => setCurrentSection(newValue)}
            textColor="primary"
          >
            {sections.map((section, index) => (
              <Tab key={index} label={section.name} />
            ))}
            <Button
              variant="contained"
              onClick={handleAddSection}
              style={{
                marginLeft: 'auto',
                backgroundColor: '#4caf50',
                color: '#fff',
              }}
            >
              Add Section
            </Button>
          </Tabs>
          {sections.map((section, sectionIndex) => (
            <Box key={sectionIndex} hidden={sectionIndex !== currentSection}>
              <Box maxHeight="400px" overflow="auto">
                <h2>{section.name}</h2>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      label="Section Name"
                      variant="outlined"
                      value={section.name}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].name = e.target.value;
                        setSections(newSections);
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Marks"
                      variant="outlined"
                      value={section.marks}
                      onChange={(e) => {
                        const newSections = [...sections];
                        const marks = parseInt(e.target.value);
                        newSections[sectionIndex].marks = isNaN(marks)
                          ? 0
                          : marks;
                        setSections(newSections);
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Schema"
                      variant="outlined"
                      value={section.schema}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].schema = e.target.value;
                        setSections(newSections);
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Question Type"
                      variant="outlined"
                      value={section.questionType}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].questionType =
                          e.target.value;
                        setSections(newSections);
                      }}
                    />
                  </Grid>
                </Grid>
                {section.questions.map((question, questionIndex) => (
                  <Box key={questionIndex} mt={2}>
                    <div>
                      <strong>Question {questionIndex + 1}:</strong>
                      <Textarea
                        placeholder={`Question ${questionIndex + 1
                          }...`}
                        style={{ width: '100%', minHeight: '100px' }}
                        value={question.question}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          sectionIndex,
                          questionIndex,
                          e.target.files && e.target.files.length > 0
                            ? e.target.files[0]
                            : null
                        )
                      }
                      style={{ marginTop: '10px' }}
                    />
                    <br />
                    <br />
                    <Grid container spacing={2}>
                      {[...Array(4).keys()].map((optionIndex) => (
                        <Grid item xs={3} key={optionIndex}>
                          <TextField
                            id={`option-${sectionIndex}-${questionIndex}-${optionIndex}`}
                            label={`Option ${optionIndex + 1}`}
                            variant="outlined"
                            value={question.options[optionIndex]}
                            onChange={(e) =>
                              handleOptionChange(
                                sectionIndex,
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <TextField
                      label="Correct Answer"
                      variant="outlined"
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleCorrectAnswerChange(
                          sectionIndex,
                          questionIndex,
                          e.target.value
                        )
                      }
                      style={{ marginTop: '10px' }}
                    />
                    <br />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleDeleteQuestion(
                          sectionIndex,
                          questionIndex
                        )
                      }
                      style={{ marginTop: '10px' }}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
                <br />
                <Button
                  variant="contained"
                  onClick={() =>
                    handleAddQuestion(sectionIndex)
                  }
                  style={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                  }}
                  startIcon={<AddCircleIcon />}
                >
                  Add Question
                </Button>
              </Box>
            </Box>
          ))}

              <Box mt={2} sx={{
                display: 'flex',
                justifyContent: "flex-end"
              }}
    
              >
            <Button
              variant="contained"
              onClick={handleManualSubmit}
              style={{
                marginRight: '10px',
                backgroundColor: '#2196f3',
                color: '#fff',
              }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              style={{
                marginLeft: '10px',
                backgroundColor: '#ff9800',
                color: '#fff',
              }}
            >
              Preview
            </Button>
            </Box>
            <Dialog
              fullScreen
              open={open}
              onClose={handleClose}
              TransitionComponent={Transition}
            >
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Preview
                  </Typography>
                  {/* Add a cancel button to close the dialog */}
                  <Button autoFocus color="inherit" onClick={handleClose}>
                    Cancel
                  </Button>
                </Toolbar>
              </AppBar>
              <List
                sx={{
                  p: 5
                }}
              >
                {/* Render the test data stored in the sections state */}
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex}

                  >
                    <Typography variant="h6">{section.name}</Typography>
                    {section.questions.map((question, questionIndex) => (
                      <div key={questionIndex}
                        style={{
                          marginBottom: '40px'
                        }}
                      >
                        <Typography variant="subtitle1">
                            <Latex>
                              {`Question ${questionIndex + 1}: ${question.question}`}
                            </Latex>
                        </Typography>
                        <ul>
                          {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>
                              <MathJaxContext>
                                <MathJax inline dynamic>
                                  {`Option ${optionIndex + 1}: ${option}`}
                                </MathJax>
                              </MathJaxContext></li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </List>
            </Dialog>

        </>
      )}
      {selectedInputMethod === InputMethod.PDF && (
        <>
          <Textarea
            placeholder="Add instructions for PDF upload here..."
            value={pdfInstructions}
            onChange={(e) => setPdfInstructions(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div>
            <h2>Upload PDF</h2>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
            {loader && <LinearIndeterminate />}
            {!loader && (
              <>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            <div>
              <Button
                variant="contained"
                onClick={handlePDFSubmit}
                disabled={!selectedFile}
                style={{
                  backgroundColor: '#2196f3',
                  color: '#fff',
                }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={handlePreview}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#ff9800',
                  color: '#fff',
                }}
              >
                Preview
              </Button>
              </div>
              </>
              )}
              </Box>
            </div>

        </>
      )}
    </Box>
  );
};

export default TestPage;
