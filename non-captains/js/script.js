var currentStatus = 1;
var sorting = false;
var item;
var houses = ["sherlock", "bond", "feluda", "byomkesh"];
var teamNames = {
	sherlock: "Team White Rabbit",
	bond: "Team Cheshire Cat",
	feluda: "Team Mad Hatter",
	byomkesh: "Team Caterpiller",
};
var loadingInterval;
var dots = 1;
var showCurrentMemberHouse;
var currentMemberComment;


$(".js-sort").on("click", function () {
	if (sorting) return;
	sorting = true;

	showCurrentMemberHouse = true;
	console.log(nextMember)
	currentMemberComment = members[nextMember].comment;
	if (members[nextMember].skip) {
		showCurrentMemberHouse = false;
		dontSkipNextTime();
	} else setHouseSorted();

	item = members[nextMember].house;
	if (item === null) {
		while (true) {
			item = houses[Math.floor(Math.random() * houses.length)];
			if (
				houseMemberCount[item] + 1 <=
				Math.round((members.length / houses.length) * 1.0)
			) {
				if (showCurrentMemberHouse) saveMemberHouse(item);
				break;
			}
		}
	}

	$(".js-sort").removeClass("bg-transparent");
	$(".js-sort").addClass(houses[dots % 4]);
	$(".js-sort p").fadeOut(1000);
	setTimeout(() => {
		$(".js-sort").addClass("loading");
		$(".js-sort p").text("Sorting");
		$(".js-sort p").fadeIn(1000);
	}, 1000);
	setTimeout(function () {
		$(".avatar__mouth").addClass("animate");
	}, 1200);
	setTimeout(function () {
		statusTwo();
	}, members[nextMember].timeout * 3500);
});

function statusOne() {
	$(".main-content").fadeOut(1000);
	$(".house-logos").fadeOut(1000);
	setTimeout(() => {
		$(".main-content__wrapper")
			.removeClass()
			.addClass("main-content__wrapper");

		if (setNextMember()) {
			currentStatus = 1;
			$(".status-1").fadeIn(1000);
			$(".status-1 div.sorting-hat,.avatar__mouth").removeClass(
				"animate"
			);
		}
	}, 1000);
}

function statusTwo() {
	$(".status-1").fadeOut(1000);
	setTimeout(() => {
		currentStatus = 2;
		sorting = false;
		clearInterval(loadingInterval);
		$(".js-sort p").fadeOut(1000);
		setTimeout(function () {
			$(".js-sort").removeClass("loading");
			$(".js-sort p").html('Sort<br><strong class="next-member"></strong>');
			$(".js-sort p").fadeIn(1000);
		}, 1000);
		$(".js-sort").addClass("bg-transparent");
		if (dots > 0) {
			$(".js-sort").removeClass(houses[(dots - 1) % 4]);
		} else {
			$(".js-sort").removeClass(houses.house);
		}

		$(".main-content__wrapper").addClass(item);
		$(".house-name").text(teamNames[item]);
		setTimeout(() => {
			$(".status-2").fadeIn(1000);
			$("." + item + "-logo").fadeIn(1000);
		}, 1000);
	}, 1000);
}

$(document).on("keydown", function (e) {
	if (currentStatus == 2) {
		if (e.keyCode === 13) {
			currentStatus = 1;
			statusOne();
		}
	} else if (e.keyCode === 68) {
		window.localStorage.removeItem("members");
		window.localStorage.removeItem("houseSorted");
		window.localStorage.removeItem("houseMemberCount");
		location.href = "";
	}
});
