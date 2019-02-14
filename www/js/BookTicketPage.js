class BookTicketPage extends Component {
  constructor(seat, props) {
    super(props);
    this._props = props
    this.seat = seat;
    this.auditorium = {}
    this.movie = {}
    this.adult = 0;
    this.kid = 0;
    this.senior = 0;
    this.addRoute(/\/program\/(.*)/, 'Visning')
    this.addEvents({
      'click .booked-tickets': 'bookSeat',
      'click .decrement-kid': 'decrementKid',
      'click .increment-kid': 'incrementKid',
      'click .decrement-adult': 'decrementAdult',
      'click .increment-adult': 'incrementAdult',
      'click .decrement-senior': 'decrementSenior',
      'click .increment-senior': 'incrementSenior'
    });
  }
  async mount() {
    let id = this.routeParts[0];
    this.salong = new Salong();
    let program = await Program.find(`.findById('${id}').populate('movie auditorium').exec()`);
    this.salongen = await this.salong.getSalong(program.auditorium.name);
    document.title = 'Program: ' + program.movie.title;
    Object.assign(this, program._props);
    this.render();
  }
  unmount() {
    delete this.salong;
  }

  async bookSeat() {
    console.log(this)

    this.booking = [];

    for (let rows = 0; rows < this.salong.salong.length; rows++) {
      let seats = this.salong.salong[rows].row[0]

      for (let seat = 0; seat < seats.length; seat++) {

        if (seats[seat].baseEl[0].className == 'choosenSeat') {

          this.booked = this.bookedSeat = { Row: seats[seat].rowNumber, Seat: seats[seat].seatNumber };
          this.booking.push(this.booked);
          console.log(this.booked.Seat);
        }
      }
    }
    console.log(this.booking);


    let elements = document.getElementsByClassName('choosenSeat');
    for (let i = elements.length - 1; i >= 0; --i) {
      elements[i].className = 'unavailableSeat';
    }
  }
  decrementKid() {
    if (this.kid) {
      this.kid--
      this.render();
    }
  }
  incrementKid() {
    this.kid++
    this.render();
  }
  decrementAdult() {
    if (this.adult) {
      this.adult--
      this.render();
    }
  }
  incrementAdult() {
    this.adult++
    this.render();
  }
  decrementSenior() {
    if (this.senior) {
      this.senior--
      this.render();
    }
  }
  incrementSenior() {
    this.senior++
    this.render();
  }
}