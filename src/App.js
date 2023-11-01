import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import { CardBody, CardFooter } from 'react-bootstrap';

import blobImage from './test_image.txt';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  let db;

  let [content, setContent] = useState('');
  let [idNumber, setIdNumber]= useState(1);
  
 

  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  // Open (or create) the database
    const request = indexedDB.open("TellOfflineDatabase", 3);

  request.onerror = event => {
    console.error('An Error has ocurred with IndexDB', event.error);
  }

  // Create the schema
  request.onupgradeneeded = function(event) {
      let db = event.target.result
     
      //create object store
      if (!db.objectStoreNames.contains('participantData')){
      db.createObjectStore("participantData", {keyPath: "id"});
      };
      if (!db.objectStoreNames.contains('examinerData')){
      db.createObjectStore("examinerData", {keyPath: "id"});
      };
      if (!db.objectStoreNames.contains('protocolsData')){
      db.createObjectStore("protocolsData", {keyPath: "id"});
      };
      if (!db.objectStoreNames.contains('responsesData')){
      db.createObjectStore("responsesData", {keyPath: "id"});
      };
  };




  request.onsuccess = event => {
    let db = event.target.result;
    const partTX = db.transaction('participantData' , 'readwrite');
    const examTX = db.transaction('examinerData' , 'readwrite');
    const protTX = db.transaction('protocolsData' , 'readwrite');
    const resTX = db.transaction('responsesData' , 'readwrite');


    let participant = partTX.objectStore('participantData')
    participant.put({id: 1 , name: "Pepe", last: "Pompin"})
    let examiner = examTX.objectStore('examinerData');
    examiner.put({id: 1, name: "Roberto", last: "Garcia"});
    let protocol = protTX.objectStore('protocolsData');
    protocol.put({id: 1 , type: "image", file: blobImage});
    let response = resTX.objectStore('responsesData');
    response.put({id: 1 , part_id: 1, res: "test de guardado de texto"})

  };



   const handleChange = event => {
    setContent(event.target.value);
    console.log('setcontent', content);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setIdNumber(idNumber + 1);
    let newMessage = {
      id: idNumber,
      text: content
    }
    addData(newMessage);

  }

  const addData = (message) =>{
    let db = request.result;
    let nm = message;

    const transaction = db.transaction('messageStore', 'readwrite');
    transaction.onerror = (event) => {
      console.error('Error opening transaction');
    }

    const objectStore = transaction.objectStore('messageStore');
    // Make a request to add our newItem object to the object store
    const objectStoreRequest = objectStore.add(nm);
    
    objectStoreRequest.onsuccess = (event) => {
      console.log('TRANSACTION SUCCESFULL');
      setContent('');
  }
}


  return (
    <Container fluid>
      <Card className='bg-light w-50 m-auto mt-4'>
        <CardBody>
          <h4>Write some Text</h4>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" rows={3}  value={content} onChange={handleChange}/>
            </Form.Group>
            <Button 
              variant="primary" 
              onClick= {handleSubmit}
              >
                Submit
            </Button>
          </Form>
          <small>ID: {idNumber} </small>
        </CardBody>
        <CardFooter>
          <p id='notifications'></p>
        </CardFooter>
      </Card>
    </Container>
  );
}

export default App;