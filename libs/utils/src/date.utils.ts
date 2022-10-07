import * as moment from 'moment';
import { getTimes } from './sunrise/sunrise';

export enum AMPM_TYPE {
  AM = 'A', PM = 'P', DAY = 'D'
};

export class DateUtils {
  public static simpleDateFormat = 'YYYY-MM-DD';
  public static simpleTimeFormat = 'HH:mm:ss';
  private static defaultLatitude = 37.5263625;
  private static defaultLongitude = 126.9404481;

  public static toMoment(date: moment.MomentInput) {
    return moment.isMoment(date) ? date : moment(date);
  }

  public static toDate(date: moment.MomentInput) {
    return date instanceof Date ? date : DateUtils.toMoment(date).toDate();
  }

  public static dayKeyToDate(dayKey: number|string) {
    dayKey = +dayKey;
    return new Date(Math.floor(dayKey / 10000), Math.floor((dayKey % 10000) / 100) - 1, dayKey % 100);
  }

  public static format(date: moment.MomentInput, format: string = DateUtils.simpleDateFormat + ' ' + DateUtils.simpleTimeFormat) {
    return DateUtils.toMoment(date).format(format);
  }

  public static from(dateString: string, format: string = DateUtils.simpleDateFormat + ' ' + DateUtils.simpleTimeFormat) {
    return moment(dateString, format);
  }

  public static getSunriseSunset(date: Date, latitude?: number, longitude?: number) {
    const times = getTimes(date, latitude || this.defaultLatitude, longitude || this.defaultLongitude);
    return [times.sunrise, times.sunset];
  }

  public static toDayKey(date: moment.MomentInput) {
    return +DateUtils.format(date, 'YYYYMMDD');
  }

  public static add(date: moment.MomentInput, amount: number, unit: moment.unitOfTime.DurationConstructor = 'd') {
    return DateUtils.toMoment(date).add(amount, unit);
    // return DateUtils.toType(added, date);
  }

  public static toType(date: moment.MomentInput, origin?: moment.MomentInput, type?: "string"|"number"|"Moment"|"Date"|"Timestamp") {
    let newType;
    if (origin) {
      if (date instanceof Date) {
        newType = "Date";
      } else if (typeof date === 'number') { // timestamp or yyyymmdd
          if (date > 21000000) { // assume timestamp
            newType = "Timestamp";
          }
          newType = "number";
      } else if (typeof date === 'string') {
          newType = "string";
      } else if (date instanceof moment) {
        newType = 'moment';
      }
    }

    if (type) {
      newType = type;
    }

    switch(newType) {
      case "string": return DateUtils.format(date, DateUtils.simpleDateFormat);
      case "number": return DateUtils.toDayKey(date);
      case "Date": return DateUtils.toDate(date);
      case "Timestamp": return DateUtils.toMoment(date).valueOf();
      case "Moment":
      default: return DateUtils.toMoment(date);
    }
  }
}
