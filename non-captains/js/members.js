// window.localStorage.removeItem("members");
// window.localStorage.removeItem("houseSorted");
// window.localStorage.removeItem("houseMemberCount");

var nextMember = -1;
var membersFetched = false;
var initialised = false;
var members = window.localStorage.getItem("members");
var houseSorted = window.localStorage.getItem("houseSorted");
var houseMemberCount = window.localStorage.getItem("houseMemberCount");
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle.
	while (currentIndex > 0) {
  
	  // Pick a remaining element.
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
  }

function fetchMembers() {
	if (!members) {
		$.get("members.json", function (response) {
			var allMembers = response.members;

			members = allMembers;
			shuffle(members);
			// for (var i = 0 ; i < allMembers.length ; i++) {
			// 	members[i] = allMembers[Math.floor(Math.random() * allMembers.length)];
			// }
			membersFetched = true;
		});
	} else {
		members = JSON.parse(members);
		membersFetched = true;
	}
}

fetchMembers();

var interval = setInterval(() => {
	if (membersFetched) {
		init();
		clearInterval(interval);
	}
}, 100);

function init() {
	if (!houseSorted) {
		houseSorted = [];
		members.forEach(() => {
			houseSorted.push(false);
		});
	} else houseSorted = JSON.parse(houseSorted);

	if (!houseMemberCount) {
		houseMemberCount = {
			sherlock: 0,
			bond: 0,
			feluda: 0,
			byomkesh: 0,
		};
		members.forEach((member) => {
			if (member.house) {
				houseMemberCount[member.house.toLowerCase()]++;
			}
		});
	} else houseMemberCount = JSON.parse(houseMemberCount);

	window.localStorage.setItem("members", JSON.stringify(members));
	window.localStorage.setItem("houseSorted", JSON.stringify(houseSorted));
	window.localStorage.setItem(
		"houseMemberCount",
		JSON.stringify(houseMemberCount)
	);
	setNextMember();
	initialised = true;
}

function setNextMember() {
	var sorted = 0;
	while (true) {
		console.log(nextMember,houseSorted,members)
		if (nextMember + 1 < houseSorted.length) {
			nextMember++;
			if (!houseSorted[nextMember]) {
				break;
			} else {
				sorted++;
			}

			if (sorted === members.length) {
				nextMember = -1;
				return false;
			}
		} else nextMember = -1;
		
	console.log(nextMember,houseSorted)
	}
	$(".next-member").text(members[nextMember].name);
	if (members[nextMember].gender === "female") {
		$(".avatar__hair").addClass("female");
		$(".avatar__hair").removeClass("male");
	} else {
		$(".avatar__hair").addClass("male");
		$(".avatar__hair").removeClass("female");
	}

	return true;
}

function saveMemberHouse(house) {
	console.log(house)
	members[nextMember].house = house;
	window.localStorage.setItem("members", JSON.stringify(members));

	houseMemberCount[house.toLowerCase()]++;
	window.localStorage.setItem(
		"houseMemberCount",
		JSON.stringify(houseMemberCount)
	);
}

function setHouseSorted() {
	houseSorted[nextMember] = true;
	window.localStorage.setItem("houseSorted", JSON.stringify(houseSorted));
}

function dontSkipNextTime() {
	members[nextMember].skip = false;
	members[nextMember].comment = members[nextMember].alternate;
	window.localStorage.setItem("members", JSON.stringify(members));
}
