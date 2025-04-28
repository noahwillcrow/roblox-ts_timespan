import { roundTowardsZero } from "@rbxts/round-towards-zero";

const SECONDS_TO_MILLISECONDS = 1000;
const MINUTES_TO_SECONDS = 60;
const MINUTES_TO_MILLISECONDS = MINUTES_TO_SECONDS * SECONDS_TO_MILLISECONDS;
const HOURS_TO_MINUTES = 60;
const HOURS_TO_MILLISECONDS = HOURS_TO_MINUTES * MINUTES_TO_MILLISECONDS;
const DAYS_TO_HOURS = 24;
const DAYS_TO_MILLISECONDS = DAYS_TO_HOURS * HOURS_TO_MILLISECONDS;

export interface TimeSpanConstructor {
	fromMilliseconds(milliseconds: number): TimeSpan;

	fromSeconds(seconds: number): TimeSpan;

	fromMinutes(minutes: number): TimeSpan;

	fromHours(hours: number): TimeSpan;

	fromDays(days: number): TimeSpan;

	/** Computes the time difference between two DateTimes: a - b */
	fromBetweenDateTimes(a: DateTime, b: DateTime): TimeSpan;
}

const DEFAULT_EPSILON = math.pow(2, -10);

const SYMBOL = {};

export function isTimeSpan(value: unknown): value is TimeSpan {
	return type(value) === "table" && (value as { [key: string]: unknown })["_symbol"] === SYMBOL;
}

/**
 * Stores a unit of time down to millisecond level precision.
 * Any TimeSpan that would have a fractional part of a millisecond is rounded away from zero to the nearest millisecond.
 */
export class TimeSpan {
	private readonly cachedComputations = new Map<string, number>();
	private readonly valueInMilliseconds: number;

	private readonly _symbol = SYMBOL;

	private constructor(valueInMilliseconds: number) {
		this.valueInMilliseconds = math.round(valueInMilliseconds);
		// const metaThis = this as unknown as { [key: string]: Callback };
		// metaThis.__add = function (other) {
		//     if (!isTimeSpan(other)) {
		//         error("Cannot add non-TimeSpan value to TimeSpan");
		//     }
		//     return this.add(other);
		// };
		// metaThis.__sub = function (other) {
		//     if (!isTimeSpan(other)) {
		//         error("Cannot subtract non-TimeSpan value from TimeSpan");
		//     }
		//     return this.sub(other);
		// };
		// metaThis.__mul = function (other) {
		//     if (type(other) !== "number") {
		//         error("Cannot multiply TimeSpan by non-number");
		//     }
		//     return this.mul(other);
		// };
		// metaThis.__unm = function () {
		//     return new TimeSpan(-1 * valueInMilliseconds);
		// };
	}

	public static create(
		days: number,
		hours: number,
		minutes: number,
		seconds: number,
		milliseconds: number,
	): TimeSpan {
		return new TimeSpan(
			days * DAYS_TO_MILLISECONDS +
				hours * HOURS_TO_MILLISECONDS +
				minutes * MINUTES_TO_MILLISECONDS +
				seconds * SECONDS_TO_MILLISECONDS +
				milliseconds,
		);
	}

	//#region Constructors
	public static fromMilliseconds(milliseconds: number): TimeSpan {
		return new TimeSpan(milliseconds);
	}

	public static fromSeconds(seconds: number): TimeSpan {
		return new TimeSpan(seconds * SECONDS_TO_MILLISECONDS);
	}

	public static fromMinutes(minutes: number): TimeSpan {
		return new TimeSpan(minutes * MINUTES_TO_MILLISECONDS);
	}

	public static fromHours(hours: number): TimeSpan {
		return new TimeSpan(hours * HOURS_TO_MILLISECONDS);
	}

	public static fromDays(days: number): TimeSpan {
		return new TimeSpan(days * DAYS_TO_MILLISECONDS);
	}

	/** Computes the time difference between two DateTimes: b - a */
	public static fromBetweenDateTimes(a: DateTime, b: DateTime): TimeSpan {
		const deltaInMilliseconds = b.UnixTimestampMillis - a.UnixTimestampMillis;
		return new TimeSpan(deltaInMilliseconds);
	}
	//#endregion

	//#region Value readers
	public totalMilliseconds() {
		return this.valueInMilliseconds;
	}

	public totalSeconds() {
		return this.memoizedCompute("totalSeconds", () => this.valueInMilliseconds / SECONDS_TO_MILLISECONDS);
	}

	public totalMinutes() {
		return this.memoizedCompute("totalMinutes", () => this.valueInMilliseconds / MINUTES_TO_MILLISECONDS);
	}

	public totalHours() {
		return this.memoizedCompute("totalHours", () => this.valueInMilliseconds / HOURS_TO_MILLISECONDS);
	}

	public totalDays() {
		return this.memoizedCompute("totalDays", () => this.valueInMilliseconds / DAYS_TO_MILLISECONDS);
	}

	public milliseconds() {
		return this.memoizedCompute(
			"milliseconds",
			() =>
				this.valueInMilliseconds -
				roundTowardsZero(this.valueInMilliseconds / SECONDS_TO_MILLISECONDS) * SECONDS_TO_MILLISECONDS,
		);
	}

	public seconds() {
		return this.memoizedCompute("seconds", () =>
			roundTowardsZero(
				this.valueInMilliseconds / SECONDS_TO_MILLISECONDS -
					roundTowardsZero(this.valueInMilliseconds / MINUTES_TO_MILLISECONDS) * MINUTES_TO_SECONDS,
			),
		);
	}

	public minutes() {
		return this.memoizedCompute("minutes", () =>
			roundTowardsZero(
				this.valueInMilliseconds / MINUTES_TO_MILLISECONDS -
					roundTowardsZero(this.valueInMilliseconds / HOURS_TO_MILLISECONDS) * HOURS_TO_MINUTES,
			),
		);
	}

	public hours() {
		return this.memoizedCompute("hours", () =>
			roundTowardsZero(
				this.valueInMilliseconds / HOURS_TO_MILLISECONDS -
					roundTowardsZero(this.valueInMilliseconds / DAYS_TO_MILLISECONDS) * DAYS_TO_HOURS,
			),
		);
	}

	public days() {
		return roundTowardsZero(this.totalDays());
	}

	public absMilliseconds() {
		return this.memoizedCompute("milliseconds", () => math.abs(this.totalMilliseconds()));
	}

	public absSeconds() {
		return this.memoizedCompute("seconds", () => math.abs(this.totalSeconds()));
	}

	public absHours() {
		return this.memoizedCompute("hours", () => math.abs(this.totalHours()));
	}

	public absMinutes() {
		return this.memoizedCompute("minutes", () => math.abs(this.totalMinutes()));
	}

	public absDays() {
		return this.memoizedCompute("days", () => math.abs(this.totalDays()));
	}
	//#endregion

	//#region Arithmetic
	public add(other: TimeSpan): TimeSpan {
		return new TimeSpan(this.valueInMilliseconds + other.valueInMilliseconds);
	}

	public sub(other: TimeSpan): TimeSpan {
		return new TimeSpan(this.valueInMilliseconds - other.valueInMilliseconds);
	}

	public mul(factor: number): TimeSpan {
		return new TimeSpan(this.valueInMilliseconds * factor);
	}

	public div(divisor: number): TimeSpan {
		return new TimeSpan(this.valueInMilliseconds / divisor);
	}

	public addTo(dateTime: DateTime): DateTime {
		return DateTime.fromUnixTimestampMillis(dateTime.UnixTimestampMillis + this.valueInMilliseconds);
	}

	public subtractFrom(dateTime: DateTime): DateTime {
		return DateTime.fromUnixTimestampMillis(dateTime.UnixTimestampMillis - this.valueInMilliseconds);
	}
	//#endregion

	//#region Comparison
	public isCloseTo(other: TimeSpan, epsilon?: number) {
		return math.abs(this.valueInMilliseconds - other.valueInMilliseconds) <= (epsilon ?? DEFAULT_EPSILON);
	}

	public isEqualTo(other: TimeSpan): boolean {
		return this.valueInMilliseconds === other.valueInMilliseconds;
	}

	public isGreaterThan(other: TimeSpan): boolean {
		return this.valueInMilliseconds > other.valueInMilliseconds;
	}

	public isGreaterThanOrEqualTo(other: TimeSpan): boolean {
		return this.isGreaterThan(other) || this.isEqualTo(other);
	}

	public isLessThan(other: TimeSpan): boolean {
		return this.valueInMilliseconds < other.valueInMilliseconds;
	}

	public isLessThanOrEqualTo(other: TimeSpan): boolean {
		return this.isLessThan(other) || this.isEqualTo(other);
	}

	//#region Short-hand
	public close(other: TimeSpan, epsilon?: number): boolean {
		return this.isCloseTo(other, epsilon);
	}

	public eq(other: TimeSpan): boolean {
		return this.isEqualTo(other);
	}

	public gt(other: TimeSpan): boolean {
		return this.isGreaterThan(other);
	}

	public gte(other: TimeSpan): boolean {
		return this.isGreaterThanOrEqualTo(other);
	}

	public lt(other: TimeSpan): boolean {
		return this.isLessThan(other);
	}

	public lte(other: TimeSpan): boolean {
		return this.isLessThanOrEqualTo(other);
	}
	//#endregion
	//#endregion

	/**
	 * Converts the TimeSpan to a string representation.
	 * @param format A format string. Defaults to "%{S}%{DD}.%{HH}:%{MM}:%{ss}.%{mmm}""\
	 * %{S} for the sign (- or blank)\
	 * %{D} for days component\
	 * %{DD} for minimum of two-digit days component\
	 * %{H} for hours component\
	 * %{HH} for minimum of two-digit hours component\
	 * %{M} for minutes component\
	 * %{MM} for minimum of two-digit minutes component\
	 * %{s} for seconds component\
	 * %{ss} for minimum of two-digit seconds component\
	 * %{m} for milliseconds component\
	 * %{mmm} for minimum of three-digit milliseconds component\
	 */
	public toString(format?: string) {
		let result = format ?? "%{S}%{DD}.%{HH}:%{MM}:%{ss}.%{mmm}";

		// sign (- or blank)
		[result] = string.gsub(result, "%%{S}", this.valueInMilliseconds < 0 ? "-" : "");

		// Days
		[result] = string.gsub(result, "%%{DD}", string.format("%02d", math.abs(this.days())));
		[result] = string.gsub(result, "%%{D}", tostring(math.abs(this.days())));

		// Hours
		[result] = string.gsub(result, "%%{HH}", string.format("%02d", math.abs(this.hours())));
		[result] = string.gsub(result, "%%{H}", tostring(math.abs(this.hours())));

		// Minutes
		[result] = string.gsub(result, "%%{MM}", string.format("%02d", math.abs(this.minutes())));
		[result] = string.gsub(result, "%%{M}", tostring(math.abs(this.minutes())));

		// Seconds
		[result] = string.gsub(result, "%%{ss}", string.format("%02d", math.abs(this.seconds())));
		[result] = string.gsub(result, "%%{s}", tostring(math.abs(this.seconds())));

		// Milliseconds
		[result] = string.gsub(result, "%%{mmm}", string.format("%03d", math.abs(this.milliseconds())));
		[result] = string.gsub(result, "%%{m}", tostring(math.abs(this.milliseconds())));

		return result;
	}

	private memoizedCompute(memoKey: string, compute: () => number) {
		if (!this.cachedComputations.has(memoKey)) {
			this.cachedComputations.set(memoKey, compute());
		}

		return this.cachedComputations.get(memoKey)!;
	}
}
