export type DayISO = `${number}-${number}-${number}`;

export function findFirstDayOfWeek(localeName: string): number {
    // weekInfo only exists on some browsers, so we default to Sunday otherwise
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/weekInfo

    const locale = new Intl.Locale(localeName) as Intl.Locale & {
        weekInfo?: { firstDay: number };
    };
    if (locale.weekInfo) {
        return locale.weekInfo.firstDay;
    }
    return 0;
}

type WeekdayInfo = {
    firstDayOfWeek: number;
    weekdayLabels: string[];
};

export function getWeekdayInfo(localeName: string): WeekdayInfo {
    const firstDayOfWeek = findFirstDayOfWeek(localeName);

    const weekdayLabelFormatter = new Intl.DateTimeFormat(localeName, {
        weekday: "short",
    });
    const weekday = new Date(2022, 9, 2 + firstDayOfWeek); // October 2, 2022 was a Sunday
    const weekdayLabels = [...Array(7)].map(() => {
        const dayLabel = weekdayLabelFormatter.format(weekday);
        weekday.setDate(weekday.getDate() + 1);
        return dayLabel;
    });

    return {
        firstDayOfWeek,
        weekdayLabels,
    };
}

export function dateArgToISO(arg?: DateConstructor["arguments"]): DayISO {
    if (!arg) return undefined;
    if (/^\d\d\d\d-\d\d-\d\d$/g.test(arg)) return arg as DayISO;
    return toISO(new Date(arg));
}

export function toISO(date: Date): DayISO {
    if (isNaN(date.getTime())) return;
    return date.toISOString().slice(0, 10) as DayISO;
}

export function fromISO(iso: DayISO): Date {
    return new Date(iso);
}

export function offsetISO(iso: DayISO, days: number): DayISO {
    const date = fromISO(iso);
    date.setUTCDate(date.getUTCDate() + days);
    return toISO(date);
}

export function localeOverride(locale?: string): string {
    return locale || navigator.language;
}
