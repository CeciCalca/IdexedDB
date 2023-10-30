import {useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import { CardBody, CardFooter } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  let db;

  let [content, setContent] = useState('');
  let [idNumber, setIdNumber]= useState(1);
  
 

  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  // Open (or create) the database
    const request = indexedDB.open("MessagesDatabase", 3);

  request.onerror = event => {
    console.error('An Error has ocurred with IndexDB', event.error);
  }

  // Create the schema
  request.onupgradeneeded = function(event) {
      let db = event.target.result
     
      //create object store
      let objectStore = db.createObjectStore("messageStore", {keyPath: "id"});
  };


  request.onsuccess = event => {
    let db = event.target.result;
    const transaction = db.transaction('messageStore' , 'readwrite');
    const store = transaction.objectStore('messageStore');
    store.put({ id: 0 , text:'test first message'});
    
    console.log('TEST MESSAGEGE ADDED SUCCESSFULLY', store.get(0));

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