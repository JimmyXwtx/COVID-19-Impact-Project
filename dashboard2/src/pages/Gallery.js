import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
import {
  Button,
  Form,
  Grid,
  Segment,
  Transition,
  Message,
  Container,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
// import uuid from 'uuid';

// import useLocalStorage from '../hooks/useLocalStorage';
import useInterval from '../hooks/useInterval';
import { submitFile, fetchGallery } from '../actions';

// import { history } from '../history';

// function getDateTime() {
//   return new Date().toISOString();
// }

const Gallery = (props) => {
  const { submitFile, fetchGallery, gallery, app } = props;
  const [loaderActive, setLoaderActive] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [files, setFiles] = useState();

  console.log('Gallery gallery', gallery);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery, app]);

  useInterval(
    () => {
      // console.log('useInterval playIndex', playIndex, 'isLoading', isLoading);
      setFeedbackText('');
    },
    feedbackText ? 3000 : null
  );

  const handleForm = async (event) => {
    setLoaderActive(true);

    const fileInput = document.querySelector('#fileInput1');
    console.log('handleForm fileInput', fileInput);

    const resp = await submitFile(fileInput.files, { title, description });

    console.log('handleForm resp', resp);

    await fetchGallery();

    const msg = resp.msg || 'Submit Contact Error';
    setFeedbackText(msg);
    setLoaderActive(false);
  };

  const fileInputChange = (event) => {
    // console.log('fileInputChange event.target', event.target);
    // console.log('fileInputChange event.target.files', event.target.files);
    // const nfiles = [];
    // for (const file of event.target.files) {
    //   nfiles.push(file);
    const nfiles = [...event.target.files];
    setFiles(nfiles);
  };

  return (
    // <Stage>
    <Container style={{ marginTop: '3rem' }}>
      {/* <Loader active={loaderActive} inline></Loader> */}
      <Grid
      // textAlign="center"
      // style={{ height: '100vh' }}
      // verticalAlign="middle"
      >
        <Grid.Column>
          <div>
            {files &&
              files.map((file) => {
                return (
                  <img
                    src={URL.createObjectURL(file)}
                    width="200"
                    style={{ display: 'inline' }}
                    alt=""
                    key={file.name}
                  />
                );
              })}
          </div>
          {/* <h3>Fill out to provide message or give feedback.</h3> */}
          {/* <Grid.Column style={{ maxWidth: 450, leftPadding: 40 }}> */}
          {/* <Grid.Column> */}
          <Form onSubmit={handleForm}>
            <input
              type="file"
              multiple
              name="photo"
              id="fileInput1"
              onChange={fileInputChange}
            />
            <Segment stacked style={{ backgroundColor: '#d5d6d2' }}>
              <Form.Input
                fluid
                // iconPosition="left"
                label="title"
                placeholder="Title..."
                value={title}
                onChange={(evt) => setTitle(evt.target.value)}
              />
              <Form.TextArea
                label="description"
                placeholder="Description..."
                value={description}
                onChange={(evt) => setDescription(evt.target.value)}
              />
              <Transition
                visible={feedbackText !== ''}
                animation="scale"
                duration={500}
              >
                <Message success header={feedbackText} content="" />
              </Transition>
              <Button primary loading={loaderActive}>
                Submit
              </Button>
            </Segment>
          </Form>
          <div>
            {gallery.items
              .concat()
              .reverse()
              .map((ent) => {
                return (
                  <div key={'g_' + ent.filename}>
                    <img
                      // Need to use href on server vs. simple .
                      src={
                        window.location.href +
                        '/../uploads/' +
                        app +
                        '/images/' +
                        ent.filename
                      }
                      width="200"
                      style={{ display: 'inline' }}
                      alt={ent.title}
                    />
                    {' ' + ent.description} <br />
                    {' ' + ent.title}
                  </div>
                );
              })}
          </div>
        </Grid.Column>
      </Grid>
    </Container>
    //{' '}
    // </Stage>
  );
};

// const Stage = styled.div`
//   background-color: #d5d6d2;
// `;

// const Brand = styled.div`
//   background-color: #fff;
//   margin: 0 auto 1.5rem;
//   max-width: 18.125rem;
// `;

const mapStateToProps = (state) => {
  return {
    admin: state.auth.admin,
    app: state.auth.app,
    gallery: state.gallery,
  };
};
export default connect(mapStateToProps, { submitFile, fetchGallery })(Gallery);
