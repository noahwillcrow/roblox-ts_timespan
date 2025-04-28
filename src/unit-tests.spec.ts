/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/// <reference types="@rbxts/testez/globals" />

import { TimeSpan } from ".";

const EPSILON = math.pow(2, -6);
const NUM_ITERS = 10;

export = () => {
	describe("Constructors", () => {
		describe("create", () => {
			it("should behave identically to fromMilliseconds if only given milliseconds", () => {
				const value = math.random(1, math.pow(2, 15));
				const created = TimeSpan.create(0, 0, 0, 0, value);
				const from = TimeSpan.fromMilliseconds(value);
				expect(created.eq(from)).to.equal(true);
			});

			it("should behave identically to fromSeconds if only given seconds", () => {
				const value = math.random(1, math.pow(2, 15));
				const created = TimeSpan.create(0, 0, 0, value, 0);
				const from = TimeSpan.fromSeconds(value);
				expect(created.eq(from)).to.equal(true);
			});

			it("should behave identically to fromMinutes if only given minutes", () => {
				const value = math.random(1, math.pow(2, 15));
				const created = TimeSpan.create(0, 0, value, 0, 0);
				const from = TimeSpan.fromMinutes(value);
				expect(created.eq(from)).to.equal(true);
			});

			it("should behave identically to fromHours if only given hours", () => {
				const value = math.random(1, math.pow(2, 15));
				const created = TimeSpan.create(0, value, 0, 0, 0);
				const from = TimeSpan.fromHours(value);
				expect(created.eq(from)).to.equal(true);
			});

			it("should behave identically to fromDays if only given days", () => {
				const value = math.random(1, math.pow(2, 15));
				const created = TimeSpan.create(value, 0, 0, 0, 0);
				const from = TimeSpan.fromDays(value);
				expect(created.eq(from)).to.equal(true);
			});

			it("should behave identically to a sum if a combination of units are non-zero", () => {
				const days = math.random(1, math.pow(2, 15));
				const hours = math.random(1, math.pow(2, 15));
				const minutes = math.random(1, math.pow(2, 15));
				const seconds = math.random(1, math.pow(2, 15));
				const milliseconds = math.random(1, math.pow(2, 15));

				const created = TimeSpan.create(days, hours, minutes, seconds, milliseconds);
				const from = TimeSpan.fromDays(days)
					.add(TimeSpan.fromHours(hours))
					.add(TimeSpan.fromMinutes(minutes))
					.add(TimeSpan.fromSeconds(seconds))
					.add(TimeSpan.fromMilliseconds(milliseconds));

				expect(created.eq(from)).to.equal(true);
			});
		});

		describe("fromMilliseconds", () => {
			it("should return exactly equal to input", () => {
				const positiveMillis = math.random(1, math.pow(2, 30));
				const negativeMillis = -1 * positiveMillis;

				const positiveTimeSpan = TimeSpan.fromMilliseconds(positiveMillis);
				const negativeTimeSpan = TimeSpan.fromMilliseconds(negativeMillis);

				expect(positiveTimeSpan.totalMilliseconds()).to.equal(positiveMillis);
				expect(negativeTimeSpan.totalMilliseconds()).to.equal(negativeMillis);
			});
		});

		describe("fromSeconds", () => {
			it("should return exactly equal to input * 1000", () => {
				const positiveMillis = math.random(1, math.pow(2, 24));
				const negativeMillis = -1 * positiveMillis;

				const positiveTimeSpan = TimeSpan.fromSeconds(positiveMillis);
				const negativeTimeSpan = TimeSpan.fromSeconds(negativeMillis);

				expect(positiveTimeSpan.totalMilliseconds()).to.equal(positiveMillis * 1000);
				expect(negativeTimeSpan.totalMilliseconds()).to.equal(negativeMillis * 1000);
			});
		});

		describe("fromMinutes", () => {
			it("should return exactly equal to input * 60,000", () => {
				const positiveMillis = math.random(1, math.pow(2, 24));
				const negativeMillis = -1 * positiveMillis;

				const positiveTimeSpan = TimeSpan.fromMinutes(positiveMillis);
				const negativeTimeSpan = TimeSpan.fromMinutes(negativeMillis);

				expect(positiveTimeSpan.totalMilliseconds()).to.equal(positiveMillis * 60_000);
				expect(negativeTimeSpan.totalMilliseconds()).to.equal(negativeMillis * 60_000);
			});
		});

		describe("fromHours", () => {
			it("should return exactly equal to input * 3,600,000", () => {
				const positiveMillis = math.random(1, math.pow(2, 24));
				const negativeMillis = -1 * positiveMillis;

				const positiveTimeSpan = TimeSpan.fromHours(positiveMillis);
				const negativeTimeSpan = TimeSpan.fromHours(negativeMillis);

				expect(positiveTimeSpan.totalMilliseconds()).to.equal(positiveMillis * 3_600_000);
				expect(negativeTimeSpan.totalMilliseconds()).to.equal(negativeMillis * 3_600_000);
			});
		});

		describe("fromDays", () => {
			it("should return exactly equal to input * 86,400,000", () => {
				const positiveMillis = math.random(1, math.pow(2, 24));
				const negativeMillis = -1 * positiveMillis;

				const positiveTimeSpan = TimeSpan.fromDays(positiveMillis);
				const negativeTimeSpan = TimeSpan.fromDays(negativeMillis);

				expect(positiveTimeSpan.totalMilliseconds()).to.equal(positiveMillis * 86_400_000);
				expect(negativeTimeSpan.totalMilliseconds()).to.equal(negativeMillis * 86_400_000);
			});
		});

		describe("fromBetweenDateTimes", () => {
			it("should return exactly as much time as was added to the earlier datetime", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const millisToAdd = math.random(1, math.pow(2, 24));
					const now = DateTime.now();
					const laterDateTime = DateTime.fromUnixTimestampMillis(now.UnixTimestampMillis + millisToAdd);
					const timeSpan = TimeSpan.fromBetweenDateTimes(now, laterDateTime);

					expect(timeSpan.totalMilliseconds()).to.equal(millisToAdd);
				}
			});

			it("should return exactly as much time as was subtracted to the later datetime", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const millisToSubtract = math.random(1, math.pow(2, 24));
					const now = DateTime.now();
					const earlierDateTime = DateTime.fromUnixTimestampMillis(
						now.UnixTimestampMillis - millisToSubtract,
					);
					const timeSpan = TimeSpan.fromBetweenDateTimes(now, earlierDateTime);

					expect(timeSpan.totalMilliseconds()).to.equal(-1 * millisToSubtract);
				}
			});
		});
	});

	describe("Value readers", () => {
		describe("totalMilliseconds", () => {
			it("should return exactly as it was constructed for whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(value);
					expect(timeSpan.totalMilliseconds()).to.equal(value);
				}
			});
		});

		describe("totalSeconds", () => {
			it("should return exactly as it was constructed for whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromSeconds(value);
					expect(timeSpan.totalSeconds()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromSeconds(value);
					expect(timeSpan.totalSeconds()).to.be.near(value, EPSILON);
				}
			});

			it("should return exactly right value when created from milliseconds", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(value * 1000);
					expect(timeSpan.totalSeconds()).to.equal(value);
				}
			});
		});

		describe("totalMinutes", () => {
			it("should return exactly as it was constructed for whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMinutes(value);
					expect(timeSpan.totalMinutes()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromMinutes(value);
					expect(timeSpan.totalMinutes()).to.be.near(value, EPSILON);
				}
			});

			it("should return exactly right value when created from milliseconds", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(value * 1000 * 60);
					expect(timeSpan.totalMinutes()).to.equal(value);
				}
			});
		});

		describe("totalHours", () => {
			it("should return exactly as it was constructed for whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromHours(value);
					expect(timeSpan.totalHours()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromHours(value);
					expect(timeSpan.totalHours()).to.be.near(value, EPSILON);
				}
			});

			it("should return exactly right value when created from milliseconds", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(value * 1000 * 60 * 60);
					expect(timeSpan.totalHours()).to.equal(value);
				}
			});
		});

		describe("totalDays", () => {
			it("should return exactly as it was constructed for whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromDays(value);
					expect(timeSpan.totalDays()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromDays(value);
					expect(timeSpan.totalDays()).to.be.near(value, EPSILON);
				}
			});

			it("should return exactly right value when created from milliseconds", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(value * 1000 * 60 * 60 * 24);
					expect(timeSpan.totalDays()).to.equal(value);
				}
			});
		});

		describe("absMilliseconds", () => {
			it("should return exactly as it was constructed for whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(value);
					expect(timeSpan.absMilliseconds()).to.equal(value);
				}
			});

			it("should return the absolute value whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMilliseconds(-1 * value);
					expect(timeSpan.absMilliseconds()).to.equal(value);
				}
			});

			it("should return the rounded-away-from-zero value for non-whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromMilliseconds(value);
					expect(timeSpan.absMilliseconds()).to.equal(math.round(value));
				}
			});

			it("should return the correct, rounded-away-from-zero, absolute value for non-whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromMilliseconds(-1 * value);
					expect(timeSpan.absMilliseconds()).to.equal(math.round(value));
				}
			});
		});

		describe("absSeconds", () => {
			it("should return exactly as it was constructed for whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromSeconds(value);
					expect(timeSpan.absSeconds()).to.equal(value);
				}
			});

			it("should return the absolute value whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromSeconds(-1 * value);
					expect(timeSpan.absSeconds()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromSeconds(value);
					expect(timeSpan.absSeconds()).to.be.near(value, EPSILON);
				}
			});

			it("should return roughly the correct, absolute value for non-whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromSeconds(-1 * value);
					expect(timeSpan.absSeconds()).to.be.near(value, EPSILON);
				}
			});
		});

		describe("absMinutes", () => {
			it("should return exactly as it was constructed for whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMinutes(value);
					expect(timeSpan.absMinutes()).to.equal(value);
				}
			});

			it("should return the absolute value whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromMinutes(-1 * value);
					expect(timeSpan.absMinutes()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromMinutes(value);
					expect(timeSpan.absMinutes()).to.be.near(value, EPSILON);
				}
			});

			it("should return roughly the correct, absolute value for non-whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromMinutes(-1 * value);
					expect(timeSpan.absMinutes()).to.be.near(value, EPSILON);
				}
			});
		});

		describe("absHours", () => {
			it("should return exactly as it was constructed for whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromHours(value);
					expect(timeSpan.absHours()).to.equal(value);
				}
			});

			it("should return the absolute value whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromHours(-1 * value);
					expect(timeSpan.absHours()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromHours(value);
					expect(timeSpan.absHours()).to.be.near(value, EPSILON);
				}
			});

			it("should return roughly the correct, absolute value for non-whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromHours(-1 * value);
					expect(timeSpan.absHours()).to.be.near(value, EPSILON);
				}
			});
		});

		describe("absDays", () => {
			it("should return exactly as it was constructed for whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromDays(value);
					expect(timeSpan.absDays()).to.equal(value);
				}
			});

			it("should return the absolute value whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24));
					const timeSpan = TimeSpan.fromDays(-1 * value);
					expect(timeSpan.absDays()).to.equal(value);
				}
			});

			it("should return roughly the same value for non-whole, positive values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromDays(value);
					expect(timeSpan.absDays()).to.be.near(value, EPSILON);
				}
			});

			it("should return roughly the correct, absolute value for non-whole, negative values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const value = math.random(1, math.pow(2, 24)) + math.random();
					const timeSpan = TimeSpan.fromDays(-1 * value);
					expect(timeSpan.absDays()).to.be.near(value, EPSILON);
				}
			});
		});

		describe("milliseconds", () => {
			it("should return the exact input if value is below one full unit of the next higher unit", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(0, 999);
					const timeSpan = TimeSpan.fromMilliseconds(value);
					expect(timeSpan.milliseconds()).to.equal(value);
				}
			});

			it("should return the input minus the next higher unit's whole part", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const smallerUnitValue = sign * math.random(0, 999);
					const largerUnitValue = sign * math.random(1, math.pow(2, 24)) * 1000;
					const timeSpan = TimeSpan.fromSeconds(largerUnitValue + smallerUnitValue / 1000);
					expect(timeSpan.milliseconds()).to.equal(smallerUnitValue);
				}
			});
		});

		describe("seconds", () => {
			it("should return the exact input if value is below one full unit of the next higher unit", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(0, 59);
					const timeSpan = TimeSpan.fromSeconds(value);
					expect(timeSpan.seconds()).to.be.near(value, EPSILON);
				}
			});

			it("should return the input minus the next higher unit's whole part", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const smallerUnitValue = sign * math.random(0, 59);
					const largerUnitValue = sign * math.random(1, math.pow(2, 15)) * 60;
					const timeSpan = TimeSpan.fromMinutes(largerUnitValue + smallerUnitValue / 60);
					expect(timeSpan.seconds()).to.be.near(smallerUnitValue, EPSILON);
				}
			});
		});

		describe("minutes", () => {
			it("should return the exact input if value is below one full unit of the next higher unit", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(0, 59);
					const timeSpan = TimeSpan.fromMinutes(value);
					expect(timeSpan.minutes()).to.be.near(value, EPSILON);
				}
			});

			it("should return the input minus the next higher unit's whole part", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const smallerUnitValue = sign * math.random(0, 59);
					const largerUnitValue = sign * math.random(1, math.pow(2, 15)) * 60;
					const timeSpan = TimeSpan.fromHours(largerUnitValue + smallerUnitValue / 60);
					expect(timeSpan.minutes()).to.be.near(smallerUnitValue, EPSILON);
				}
			});
		});

		describe("hours", () => {
			it("should return the exact input if value is below one full unit of the next higher unit", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(0, 23);
					const timeSpan = TimeSpan.fromHours(value);
					expect(timeSpan.hours()).to.be.near(value, EPSILON);
				}
			});

			it("should return the input minus the next higher unit's whole part", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const smallerUnitValue = sign * math.random(0, 23);
					const largerUnitValue = sign * math.random(1, math.pow(2, 15)) * 24;
					const timeSpan = TimeSpan.fromDays(largerUnitValue + smallerUnitValue / 24);
					expect(timeSpan.hours()).to.be.near(smallerUnitValue, EPSILON);
				}
			});
		});

		describe("days", () => {
			it("should return the roughly the exact input since there is no higher unit", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(0, 59);
					const timeSpan = TimeSpan.fromDays(value);
					expect(timeSpan.days()).to.be.near(value, EPSILON);
				}
			});
		});
	});

	describe("Comparators", () => {
		describe("isCloseTo and close", () => {
			it("should return false for very different values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isCloseTo(b)).to.equal(false);
					expect(a.close(b)).to.equal(false);
				}
			});

			it("should return true for very different values when given huge epsilon", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isCloseTo(b, math.pow(2, 11))).to.equal(true);
					expect(a.close(b, math.pow(2, 11))).to.equal(true);
				}
			});

			it("should return true for nearly equal values, but different TimeSpan instances", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(-math.pow(2, -9), math.pow(2, -9)));
					expect(a.isCloseTo(b)).to.equal(true);
					expect(a.close(b)).to.equal(true);
				}
			});

			it("should return true for the same TimeSpan instance", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					expect(a.isCloseTo(a)).to.equal(true);
					expect(a.close(a)).to.equal(true);
				}
			});
		});

		describe("isEqualTo and eq", () => {
			it("should return false for different values", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isEqualTo(b)).to.equal(false);
					expect(a.eq(b)).to.equal(false);
				}
			});

			it("should return true for equal values, but different TimeSpan instances", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value);
					expect(a.isEqualTo(b)).to.equal(true);
					expect(a.eq(b)).to.equal(true);
				}
			});

			it("should return true for the same TimeSpan instance", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					expect(a.isEqualTo(a)).to.equal(true);
					expect(a.eq(a)).to.equal(true);
				}
			});
		});

		describe("isGreaterThan and gt", () => {
			it("should return false for equal values on different TimeSpan instances", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value);
					expect(a.isGreaterThan(b)).to.equal(false);
					expect(a.gt(b)).to.equal(false);
				}
			});

			it("should return false for comparing the same TimeSpan instance", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					expect(a.isGreaterThan(a)).to.equal(false);
					expect(a.gt(a)).to.equal(false);
				}
			});

			it("should return false if actually less than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isGreaterThan(b)).to.equal(false);
					expect(a.gt(b)).to.equal(false);
				}
			});

			it("should return true if actually greater than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value - math.random(1, math.pow(2, 10)));
					expect(a.isGreaterThan(b)).to.equal(true);
					expect(a.gt(b)).to.equal(true);
				}
			});
		});

		describe("isGreaterThanOrEqualTo and gte", () => {
			it("should return true for equal values on different TimeSpan instances", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value);
					expect(a.isGreaterThanOrEqualTo(b)).to.equal(true);
					expect(a.gte(b)).to.equal(true);
				}
			});

			it("should return true for comparing the same TimeSpan instance", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					expect(a.isGreaterThanOrEqualTo(a)).to.equal(true);
					expect(a.gte(a)).to.equal(true);
				}
			});

			it("should return false if actually less than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isGreaterThanOrEqualTo(b)).to.equal(false);
					expect(a.gte(b)).to.equal(false);
				}
			});

			it("should return true if actually greater than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value - math.random(1, math.pow(2, 10)));
					expect(a.isGreaterThanOrEqualTo(b)).to.equal(true);
					expect(a.gte(b)).to.equal(true);
				}
			});
		});

		describe("isLessThan and lt", () => {
			it("should return false for equal values on different TimeSpan instances", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value);
					expect(a.isLessThan(b)).to.equal(false);
					expect(a.lt(b)).to.equal(false);
				}
			});

			it("should return false for comparing the same TimeSpan instance", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					expect(a.isLessThan(a)).to.equal(false);
					expect(a.lt(a)).to.equal(false);
				}
			});

			it("should return true if actually less than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isLessThan(b)).to.equal(true);
					expect(a.lt(b)).to.equal(true);
				}
			});

			it("should return false if actually greater than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value - math.random(1, math.pow(2, 10)));
					expect(a.isLessThan(b)).to.equal(false);
					expect(a.lt(b)).to.equal(false);
				}
			});
		});

		describe("isLessThanOrEqualTo and lte", () => {
			it("should return true for equal values on different TimeSpan instances", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value);
					expect(a.isLessThanOrEqualTo(b)).to.equal(true);
					expect(a.lte(b)).to.equal(true);
				}
			});

			it("should return true for comparing the same TimeSpan instance", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					expect(a.isLessThanOrEqualTo(a)).to.equal(true);
					expect(a.lte(a)).to.equal(true);
				}
			});

			it("should return true if actually less than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value + math.random(1, math.pow(2, 10)));
					expect(a.isLessThanOrEqualTo(b)).to.equal(true);
					expect(a.lte(b)).to.equal(true);
				}
			});

			it("should return false if actually greater than", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const sign = i % 2 === 0 ? -1 : 1;
					const value = sign * math.random(1, math.pow(2, 15));
					const a = TimeSpan.fromMilliseconds(value);
					const b = TimeSpan.fromMilliseconds(value - math.random(1, math.pow(2, 10)));
					expect(a.isLessThanOrEqualTo(b)).to.equal(false);
					expect(a.lte(b)).to.equal(false);
				}
			});
		});
	});

	describe("Arithmetic", () => {
		describe("add", () => {
			it("should add appropriately", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const c = a.add(b);
					expect(c.totalMilliseconds()).to.equal(a.totalMilliseconds() + b.totalMilliseconds());
				}
			});

			it("should be commutative", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const c = a.add(b);
					const d = b.add(a);
					expect(c.totalMilliseconds()).to.equal(d.totalMilliseconds());
				}
			});
		});

		describe("sub", () => {
			it("should subtract appropriately", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const c = a.sub(b);
					expect(c.totalMilliseconds()).to.equal(a.totalMilliseconds() - b.totalMilliseconds());
				}
			});

			it("should not be commutative", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const c = a.sub(b);
					const d = b.sub(a);
					expect(c.totalMilliseconds()).to.never.equal(d.totalMilliseconds());
				}
			});
		});

		describe("mul", () => {
			it("should multiply appropriately", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = math.random(-math.pow(2, 5), math.pow(2, 5));
					const c = a.mul(b);
					expect(c.totalMilliseconds()).to.equal(a.totalMilliseconds() * b);
				}
			});
		});

		describe("div", () => {
			it("should divide appropriately", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = math.random(-math.pow(2, 5), math.pow(2, 5));
					const c = a.div(b);
					expect(c.totalMilliseconds()).to.equal(math.round(a.totalMilliseconds() / b));
				}
			});
		});

		describe("addTo", () => {
			it("should add appropriately", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = DateTime.fromUnixTimestampMillis(math.random(0, math.pow(2, 15)));
					const c = a.addTo(b);
					expect(c.UnixTimestampMillis).to.equal(a.totalMilliseconds() + b.UnixTimestampMillis);
				}
			});
		});

		describe("subtractFrom", () => {
			it("should subtract appropriately", () => {
				for (let i = 0; i < NUM_ITERS; i++) {
					const a = TimeSpan.fromMilliseconds(math.random(-math.pow(2, 15), math.pow(2, 15)));
					const b = DateTime.fromUnixTimestampMillis(math.random(0, math.pow(2, 15)));
					const c = a.subtractFrom(b);
					expect(c.UnixTimestampMillis).to.equal(b.UnixTimestampMillis - a.totalMilliseconds());
				}
			});
		});
	});

	describe("toString", () => {
		it("should use default format if not given one", () => {
			const milliseconds = 5977237548;
			const expectedString = "69.04:20:37.548";
			const timeSpan = TimeSpan.fromMilliseconds(milliseconds);
			expect(timeSpan.toString()).to.equal(expectedString);
		});

		it("should obey the format it is given", () => {
			{
				const milliseconds = 5977207048;
				const expectedString = "69d 4h 20m 7s 048ms";
				const timeSpan = TimeSpan.fromMilliseconds(milliseconds);
				expect(timeSpan.toString("%{D}d %{H}h %{MM}m %{s}s %{mmm}ms")).to.equal(expectedString);
			}

			{
				const milliseconds = 100927048;
				const expectedString = "01d 04h 2m 07s 48ms";
				const timeSpan = TimeSpan.fromMilliseconds(milliseconds);
				expect(timeSpan.toString("%{DD}d %{HH}h %{M}m %{ss}s %{m}ms")).to.equal(expectedString);
			}
		});
	});
};
