// This is wehre we are rendering the list of students for each campus. It takes props in the from of a selected campus form our all 
// campus view. The list of students are attactched to the sleected campuses information


import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Media} from 'react-bootstrap';

export default class StudentList extends Component{
    constructor(props){
        super (props)
        this.state={
            // selectedCampus: this.props.campus,
            students: this.props.campus.student,
            newStudentName: "",
            newStudentEmail: ""
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    componentWillReceiveProps(nextProps){
        // console.log('nextprops', nextProps);
        // console.log('old props', this.props);
        if (this.props.campus.id !== nextProps.campus.id) {
            this.setState({students: nextProps.campus.student});
        }
    }
    handleSubmit(ev){
        ev.preventDefault()
        axios.post('api/students',
        {name:this.state.newStudentName,
          email: this.state.newStudentEmail,
            campusId:this.props.campus.id})
        .then(response=>{
          console.log("SAVE SUCESSFUL", response.data)
          console.log("NEW STATE STUDENTS", this.state)
          // this.setState({newCampus: ""})
          this.setState({students:[...this.state.students, response.data],
            })
        })
        // .then(response=>this.setState({newStudent:{}}))
        .catch(console.log)
        
      }


      handleChange(ev){
        console.log("Target Name",ev.target.name,"Target Change",ev.target.value)
        console.log(this.state)
        let n = ev.target.name
        console.dir('target name', ev.target);
        this.setState({[n]: ev.target.value})
      }

    

      handleClick(studentId){
        console.log("Clicked")
        if(confirm ('Are you sure woy want ot dleete this student?')){
        axios.delete(`api/students/${studentId}`)
        .then(response=>axios.get('/api/students'))
        .then(response=>response.data)
        .then(allstudents=>this.setState({students: allstudents}))
        .catch(console.log)
        }
      }



    render(){
    const campus =this.props.campus
    const students =this.state.students
    // const studentId = this.state.students.campusId
    const campusId =this.props.campus.id
    const filteredStudents =students.filter(student=>+student.campusId===+campusId)
    
   
    let count=1
    return ( 
        
        <div className="col-xs-4 studentBox">
          <div id='studentForm'>
            <h2 className="campusName">{`${campus.name} Campus Students`}</h2>

            <form onSubmit={this.handleSubmit} style={{marginLeft:'15px'}}>
              <h4>Add a Student</h4> 
              name
              <input name="newStudentName"onChange = {this.handleChange}type="text" value={this.state.newStudentName} ></input> <br />
              email
              <input name="newStudentEmail" onChange = {this.handleChange}type="text" value={this.state.newStudentEmail} ></input>
              <input type="submit"></input>
            </form>
          
          </div>

          
          <div id='studentListMap'>

          {
            
            filteredStudents.map(student => (
         
            <div key={student.id}>
              <Media  className='student'>
                <Media.Left align="top">
                  <img width={64} height={64} src={student.imageUrl} alt="placeholder thumbnail" />
                </Media.Left>
                <Media.Body>
                  <Media.Heading >
                    <Link to ={`students/${student.id}`}><h3 id='planetHeading'>{`${count++}. ${student.name}`}</h3></Link>
                    <button className="btn btn-danger" onClick={()=>this.handleClick(student.id)}>X</button>
                  </Media.Heading>
                </Media.Body>
              </Media>
              </div>
            ))  
          }</div>
        </div>
      )
    }
}