// import React, { Fragment } from 'react';
import { Component, Fragment } from 'react';
import { Button, Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

function RenderCampsite({campsite}) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardImg top src={campsite.image} alt={campsite.name} />
        <CardBody>
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

class CommentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      rating: '',
      author: '',
      text: '',
      touched: {
        rating: false,
        author: false,
        text: false,
      }
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
  }

  render() {
    return (
      <Fragment>
        <Button outline onClick={this.toggleModal}><i className="fa-lg fa fa-pencil" /> Submit Comment</Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
              <LocalForm onSubmit={values => this.handleSubmit(values)}>
                <div className="form-group">
                  <Label htmlFor="rating">Rating</Label>
                  <Control.select model=".rating" id="rating" name="rating" className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </div>
                <div className="form-group">
                  <Label htmlFor="author">Author</Label>
                  <Control.text model=".author" id="author" name="author" className="form-control" placeholder="Your Name" validators={{
                    minLength: minLength(2),
                    maxLength: maxLength(15)
                    }} />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    component="div"
                    messages={{
                      minLength: 'Must be at least 2 characters',
                      maxLength: 'Must be 15 characters or less'
                    }} />
                </div>
                <div className="form-group">
                  <Label htmlFor="text">Comment</Label>
                  <Control.textarea model=".text" id="text" name="text" className="form-control" rows="6" />
                </div>
                <Button type="submit" value="submit" color="primary">Submit</Button>
              </LocalForm>
            </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

function RenderComments({comments, addComment, campsiteId}) {
  if (comments.length) {
    return (
      <div className="col-md-5 m-1">
        <h4 className="mb-3">Comments</h4>
        <div>
        {comments.map(comment => {
          return (
              <figure key={comment.id}>
                <blockquote className="mb-0">{comment.text}</blockquote>
                <figcaption>-- {comment.author}, <span>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</span></figcaption>
              </figure>
          )
        })}
        </div>
        <CommentForm campsiteId={campsiteId} addComment={addComment} />
      </div>
    );
  }
  return <div />
}
  
function CampsiteInfo(props) {
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
            <RenderCampsite campsite={props.campsite} />
            <RenderComments 
              comments={props.comments} 
              addComment={props.addComment}
              campsiteId={props.campsite.id}
            />
        </div>
      </div>
    );
  }
  return <div />;
}


export default CampsiteInfo;
