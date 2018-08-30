import { Component, Prop, State, Event } from '@stencil/core';
import { EventEmitter } from 'events';

@Component({
  tag: 'blaze-calendar'
})
export class Calendar {
  @Prop()
  date: string;

  @Prop()
  type: string = 'brand';

  @State()
  _date: Date = new Date();

  @State()
  _selectedDate: Date;

  @Event()
  onSelect: EventEmitter;

  days: Array<string> = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  componentWillLoad() {
    const date = this.date || new Date();
    this._date = new Date(date);
    this._selectedDate = this._date;
  }

  getMonthName() {
    return this.months[this._date.getMonth()];
  }

  getFirstDay() {
    return new Date(this._date.getFullYear(), this._date.getMonth(), 1).getDay();
  }

  getLastDay() {
    return new Date(this._date.getFullYear(), this._date.getMonth() + 1, 0).getDay();
  }

  getTotalDaysInMonth(diff: number = 0) {
    return new Date(this._date.getFullYear(), this._date.getMonth() + 1 + diff, 0).getDate();
  }

  selectDate(date) {
    this._selectedDate = date;
    this.onSelect.emit(date);
  }

  renderDayButton(date: Date) {
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === this._selectedDate.toDateString();

    const inMonthClass = date.getMonth() === this._date.getMonth() ? 'c-calendar__date--in-month' : '';
    const selectedClass = isSelected ? `c-button c-button--${this.type}` : '';

    return (
      <button
        class={`c-calendar__date ${inMonthClass} ${selectedClass}`}
        aria-current={isToday && 'date'}
        aria-selected={isSelected.toString()}
        onClick={() => this.selectDate(date)}>
        {date.getDate()}
      </button>
    );
  }

  populateDaysPreviousMonth() {
    const days: Array<object> = [];
    const totalDaysInPreviousMonth = this.getTotalDaysInMonth(-1);
    for (let i = totalDaysInPreviousMonth; i > totalDaysInPreviousMonth - this.getFirstDay(); i--) {
      const date = new Date(this._date);
      date.setMonth(this._date.getMonth() - 1);
      date.setDate(i);
      const day = new Date(date);
      days.unshift(this.renderDayButton(day));
    }

    return days;
  }

  populateDaysCurrentMonth() {
    const days: Array<object> = [];
    const totalDaysInMonth: number = new Date(this._date.getFullYear(), this._date.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(this._date);
      date.setDate(i);
      const day = new Date(date);
      days.push(this.renderDayButton(day));
    }

    return days;
  }

  populateDaysNextMonth() {
    const days: Array<object> = [];
    for (let i = 1; i < 7 - this.getLastDay(); i++) {
      const date = new Date(this._date);
      date.setDate(i);
      date.setMonth(this._date.getMonth() + 1);
      const day = new Date(date);
      days.push(this.renderDayButton(day));
    }

    return days;
  }

  navYear(diff) {
    const date = new Date(this._date);
    date.setFullYear(this._date.getFullYear() + diff);
    this._date = new Date(date);
  }

  navMonth(diff) {
    const date = new Date(this._date);
    date.setMonth(this._date.getMonth() + diff);
    this._date = new Date(date);
  }

  today() {
    this.selectDate(new Date());
    this._date = new Date();
  }

  render() {
    const typeClass = this.type ? `c-button--${this.type}` : '';

    return (
      <div class="c-calendar">
        <button class="c-calendar__control c-calendar__control--prev-year" onClick={() => this.navYear(-1)}>
          &lsaquo;
        </button>
        <div class="c-calendar__header c-calendar__header--year">{this._date.getFullYear()}</div>
        <button class="c-calendar__control c-calendar__control--next-year" onClick={() => this.navYear(1)}>
          &rsaquo;
        </button>

        <button class="c-calendar__control c-calendar__control--prev-month" onClick={() => this.navMonth(-1)}>
          &lsaquo;
        </button>
        <div class="c-calendar__header c-calendar__header--month">{this.getMonthName()}</div>
        <button class="c-calendar__control c-calendar__control--next-month" onClick={() => this.navMonth(1)}>
          &rsaquo;
        </button>

        {this.days.map((day) => (
          <div class="c-calendar__day">{day}</div>
        ))}

        {this.populateDaysPreviousMonth()}

        {this.populateDaysCurrentMonth()}

        {this.populateDaysNextMonth()}

        <div class="c-calendar__footer">
          <button class={`c-calendar__today c-button c-button--block ${typeClass}`} onClick={() => this.today()}>
            Today
          </button>
        </div>
      </div>
    );
  }
}
