import React from "react";
import REST from "../REST";
import SeatRow from "./SeatRow";
import BookingNumberGenerator from "./BookingNumberGenerator"
import LightImage from "../images/light.png";
class Auditorium extends REST {}
class Program extends REST {}
class Ticket extends REST {}

class Salong extends React.Component {
  constructor(props) {
    super(props);
    this.salong = [];
    this.auditoriumSeats = 1;
    this.allSeats = new Array;
    this.row = new Array;
    this.bookingNumber = new BookingNumberGenerator
    this.state = { adult: 2, kid: 0, senior: 0, total: 170, totalTickets: 2 };
    this.adult = 2;
    this.kid = 0;
    this.senior = 0;
    this.total = 170;
    this.totalTickets = 2;
    this.program = '';
    this.getBookedSeats();
  }

  async getBookedSeats(){
    let pathArray = window.location.pathname.split("/");
    this.programPath = pathArray[2];
    this.program = await Program.find(
      `.findOne({_id:'${this.programPath}'}).populate().exec()`
    );
    await this.setState({title: this.program.movie.title, salongName: this.program.auditorium.name})
    this.auditorium = await Auditorium.find(
      ".findOne({name:/" + this.program.auditorium.name + "/})"
    );
    if (!this.auditorium) {
      return;
    }


    this.salong = this.auditorium.seatsPerRow.map((numberOfSeats, index) => (
      <SeatRow
        key={index}
        numberOfSeats={numberOfSeats}
        seatsInSalong={(this.auditoriumSeats += numberOfSeats)}
        rowNum={index + 1}
        totalTickets={this.state.totalTickets}
        allSeats={this.allSeats}
        row={this.row}
      />
    ));

    this.setState({ state: this.state });

    this.getTickets = await Ticket.find(`.find({programId: '${this.programPath}'})`)
    this.inDatabas = []

    for (let ticket of this.getTickets) {
      for (let seat of ticket.seats) {
        this.inDatabas.push(seat);
      }
    }

    for(let row of this.allSeats){
      for(let seat of row){
        for(let bookedSeatInDatabas of this.inDatabas){
          if(seat.seatNum == bookedSeatInDatabas.seatNum){
            seat.setState({class: 'unavailableSeat'})
          }
        }
      }
    }


  }

  decrementKid() {
    if (this.kid) {
      this.kid--;
      this.total -= 50;
      this.totalTickets--
      for(let rowState of this.row){
        rowState.setState({totalTickets: this.totalTickets})
      }
      this.setState({kid: this.kid, totalTickets: this.totalTickets})
      this.toMannyTickets = "";
    }
  }
  incrementKid() {
    if (this.totalTickets < 7){
      this.kid++;
      this.total += 50;
      this.totalTickets++
      for(let rowState of this.row){
        rowState.setState({totalTickets: this.totalTickets})
      }
      this.setState({kid: this.kid, totalTickets: this.totalTickets})
    } else {
      this.toMannyTickets = <div className="alert alert-danger mt-4" role="alert"> Det går bara att boka 7 biljetter åt gången! </div>
      this.setState({tickets: this.totalTickets});
    }
  }
  decrementAdult() {
    if (this.adult) {
      this.adult--;
      this.total -= 85;
      this.totalTickets--
      for(let rowState of this.row){
        rowState.setState({totalTickets: this.totalTickets})
      }
      this.setState({adult: this.adult, totalTickets: this.totalTickets})
      this.toMannyTickets = "";
    }
  }
  incrementAdult() {
    if (this.totalTickets < 7) {
      this.adult++;
      this.total += 85;
      this.totalTickets++
      for(let rowState of this.row){
        rowState.setState({totalTickets: this.totalTickets})
      }
      this.setState({adult: this.adult, totalTickets: this.totalTickets})
    } else {
      this.toMannyTickets = <div className="alert alert-danger mt-4" role="alert"> Det går bara att boka 7 biljetter åt gången! </div>
      this.setState({tickets: this.totalTickets});
    }
  }
  decrementSenior() {
    if (this.senior) {
      this.senior--;
      this.total -= 65;
      this.totalTickets--
      for(let rowState of this.row){
        rowState.setState({totalTickets: this.totalTickets})
      }
      this.setState({senior: this.senior, totalTickets: this.totalTickets})
      this.toMannyTickets = "";
    }
  }
  incrementSenior() {
    if (this.totalTickets < 7) {
      this.senior++;
      this.total += 65;
      this.totalTickets++;
      for(let rowState of this.row){
        rowState.setState({totalTickets: this.totalTickets})
      }
      this.setState({senior: this.senior, totalTickets: this.totalTickets})
    } else {
      this.toMannyTickets = <div className="alert alert-danger mt-4" role="alert"> Det går bara att boka 7 biljetter åt gången! </div>
      this.setState({tickets: this.totalTickets});
    }
  }

  select() {
    for(let row of this.allSeats){
      for(let seat of row){
        if(seat.state.class == 'choosenSeat'){
          seat.setState({class: 'seat'})
        }
        if(seat.state.class == 'hoverChoosenSeat'){
          seat.setState({class: 'choosenSeat'})
        }
      }
    }
  }


  async book(){
    await setTimeout(function(){}, 1000);
    this.bookedSeats = []
    for(let row of this.allSeats){
      for(let seat of row){
        if(seat.state.class == 'choosenSeat'){
          seat.setState({class: 'unavailableSeat'})
          this.bookedSeats.push({seatNum: seat.seatNum, rowNum: seat.rowNum})
        }
      }
    }

    this.bookingNum = await this.bookingNumber.getBookingNumber()


    this.ticket = new Ticket({
      bookingNum: this.bookingNum,
      purchasedAt: new Date(),
      price: this.total,
      program: this.program,
      programId: this.programPath,
      seats: this.bookedSeats.reverse()
    });

    await this.ticket.save();
    console.log(this.ticket.program.movie.title);


    this.props.bookedSeats.push(this.bookedSeats)
    console.log('booked')
  }

  /*
    for (let numberOfSeatsInRow of this.auditorium.seatsPerRow) {
      this.seats += numberOfSeatsInRow;

      this.seatRow = new SeatRow;
      this.seatRow.getSeatInRow(numberOfSeatsInRow);
      // create one row of seats

      for (let seatCounter = 0; seatCounter < numberOfSeatsInRow; seatCounter++) {
        this.seats--
      }
      this.seats += numberOfSeatsInRow

      this.rows++
      this.salong = this.salong.map( a => 
      <SeatRow/>)
    this.setState({ state: this.state });
    return this.salong
    }*/

  render() {
    return(

      <section className="book-ticket">
        <div>
          <div className="theShow">
            <h2>{this.state.title}</h2>
            <h3>📆 {this.program.date}</h3>
            <h3>🕑 {this.program.time}</h3>
          </div>
          <div className="error">
              {this.toMannyTickets}
          </div>
          <div className="ticket-selector">
            <div className="row mt-4 mb-4">
              <div className="price col-12 col-md-4 mt-4">
                <p>Ordinarie (85 kr/st)</p>
                <div className="ticket-incrementor adult">
                  <button
                    className="decrement-adult btn btn-secondary mr-2"
                    onClick={this.decrementAdult.bind(this)}
                  >
                    -
                  </button>
                  {this.adult}
                  <button 
                    className="increment-adult btn btn-secondary ml-2"
                    onClick={this.incrementAdult.bind(this)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="price col-12 col-md-4 mt-4">
                <p>Pensionär (65 kr/st)</p>
                <div className="ticket-incrementor senior">
                  <button 
                    className="decrement-senior btn btn-secondary mr-2"
                    onClick={this.decrementSenior.bind(this)}
                  >
                    -
                  </button>
                  {this.senior}
                  <button 
                    className="increment-senior btn btn-secondary ml-2"
                    onClick={this.incrementSenior.bind(this)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="price col-12 col-md-4 mt-4">
                <p>Barn (50 kr/st)</p>
                <div className="ticket-incrementor kids">
                  <button 
                    className="decrement-kid btn btn-secondary mr-2"
                    onClick={this.decrementKid.bind(this)}
                  >
                    -
                  </button>
                  {this.kid}
                  <button 
                    className="increment-kid btn btn-secondary ml-2"
                    onClick={this.incrementKid.bind(this)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <h4>Totalpris: {this.total}</h4>
          </div>
          <div className="row justify-content-center">
            <div className="screen">
              <img className="light" src={LightImage}
              />
            </div>
          </div>

          <div className="salong" onClick={this.select.bind(this)}>{this.salong}</div>
        <div className="row">
          <button
            type="button"
            className=" col-md-2 btn btn-secondary booked-tickets p-2 m-4 mt-5 mb-4"
            onClick={this.book.bind(this)}
          >
            Boka biljetter
          </button>
        </div>
        </div>
      </section>
    );
  }
}

export default Salong;
