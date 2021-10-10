import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e.target.files);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
      // Get the presigned URL
      try {
        const token = localStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          headers: {
            Authorization: `Basic ${token}`,
          },
          url,
          params: {
            name: encodeURIComponent(file.name)
          }
        })
        console.log('File to upload: ', file.name)
        console.log('Uploading to: ', response.data.url)
        const result = await fetch(response.data.url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/csv',
          },
          body: file
        })
        console.log('Result: ', result)
        setFile('');
      } catch (e) {
        switch (e.status) {
          case 401:
            toast.error('Unauthorized', {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            break;
          case 403:
            toast.error('Access denied');
            break;
          default:
            toast.error('Something gone wrong');
            console.log(e);
        }
      }
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
      <ToastContainer position="bottom-left"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover/>
    </div>
  );
}
