player = {
	// Start
	baseRate: 1 / 315569520,
	antimatter: 0,
	matter: 0,
	amRate: function() {
		if (player.onOverdrive == true && player.extraSeconds == 0) return 0;
		return this.baseRate * this.reuMult(0) * this.pxuMult(0, 1) / this.amNerf();
	},
	amNerf: function() {
		if (this.matter >= 1 / 15778476) return Math.pow(this.matter * 15778476, 3 * this.enBuff());
		return 1;
	},
	mRate: function() {
		if (player.onOverdrive == true && player.extraSeconds == 0) return 0;
		return this.baseRate * this.muMult(0) * this.reuMult(0) * this.pxuMult(1, 1) * this.pxuMult(2, 1) / this.mNerf();
	},
	mNerf: function() {
		if (this.antimatter + this.matter >= 1 / (15778476 * this.pxuMult(1, 2))) {
			return Math.pow((this.antimatter + this.matter) * 15778476 * this.pxuMult(1, 2), 1.5 * this.enBuff());
		}
		return 1;
	},
	
	// Modules
	mu: [0, 0, 0],
	muPower: function(index) {
		if (index == 0) return Math.pow(this.pxuMult(0, 0), Math.floor(this.mu[0] / 10));
		else if (index == 1) return 2;
		else if (index == 2) return 1;
	},
	muCost: function(index) {
		if (index == 0) return 1e-7 * Math.pow(1.2 + this.mu[0] * 0.003, this.mu[0] * this.enBuff());
		else if (index == 1) return 1e-6 * Math.pow(4, this.mu[1] * this.enBuff());
		else if (index == 2) return 1e-5 * Math.pow(9 + 2 * this.mu[2], 2 * this.mu[2]);
		else return Infinity;
	},
	muMult: function(index) {
		if (index == 0) return this.mu[0] * this.muPower(0) * (Math.pow(this.muPower(1) * this.mu[1], this.muPower(2) * this.mu[2] + 1) + 1) + 1;
		else if (index == 1) return Math.pow(this.muPower(1) * this.mu[1], this.muPower(2) * this.mu[2] + 1) + 1;
		else if (index == 2) return this.muPower(2) * this.mu[2] + 1;
		else return 0;
	},
	
	// Reactor
	energy: 0,
	renergy: 0,
	enBuff: function() {
		return Math.pow(0.965, Math.min(this.energy, 2e-6) / 6e-8);
	},
	enNerf: function() {
		return Math.pow(1.24, this.energy / 6e-8);
	},
	enResetReq: function() {
		return this.enNerf() * 1e-6;
	},
	reu: [0, 0],
	reuPower: function(index, next=0) {
		// The 'next' argument is solely for use in this.pxuMult(0, 3).
		if (index == 0) return 1.17 * Math.pow(1.08, this.pxu[0][3] + next) * this.reuMult(1);
		else if (index == 1) return 1.03;
		else return 0;
	},
	reGain: function() {
		if (player.onOverdrive == true && player.extraSeconds == 0) return 0;
		res = this.energy * this.pxuMult(0, 2) * this.pxuMult(2, 2);
		if (player.pxu[2][3] == 0) return res;
		return res * this.reuMult(0);
	},
	reuCost: function(index) {
		if (index == 0) return 1e-5 * Math.pow(2.5, this.reu[0]);
		else if (index == 1) return 1e-4 * Math.pow(5, this.reu[1]);
		else return Infinity;
	},
	reuMult: function(index) {
		if (index == 0) return Math.pow(this.reuPower(0), this.reu[0]);
		else if (index == 1) return Math.pow(this.reuPower(1), this.reu[1]);
		else return 0;
	},
	enCap: function() {
		return 2e-6 * this.pxuMult(2, 0);
	},
	
	// Paradox
	// unlockedParadox: false,
	unlockedParadox: true,
	pxenergy: 20e-6,
	maxExtraSeconds: function() {
		return this.pxuMult(1, 3);
	},
	extraSeconds: 0,
	onOvertime: false,
	pxu: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
	pxuCost: function(row, col) {
		if (row == 0) {
			if (col == 0) return 1e-6 * (2 * Math.pow(3, this.pxu[0][0]));
			else if (col == 1) return 1e-6 * (2 * Math.pow(5, this.pxu[0][1]));
			else if (col == 2) return 1e-6 * (2 * Math.pow(2, this.pxu[0][2]));
			else if (col == 3) return 1e-6 * (2 * Math.pow(4, this.pxu[0][3]));
		}
		if (row == 1) {
			if (col == 0) return 1e-6 * Math.pow(3, this.pxu[1][0] + 1);
			else if (col == 1) return 3e-6 * Math.pow(4, this.pxu[1][1]);
			else if (col == 2) return 3e-6 * Math.pow(5, this.pxu[1][2]);
			else if (col == 3) return 3e-6 * Math.pow(2, this.pxu[1][3]);
		}
		if (row == 2) {
		    if (col == 0) return 1e-6 * Math.pow(4, this.pxu[2][0] + 1);
			else if (col == 1) return 4e-6 * Math.pow(5, this.pxu[2][1]);
			else if (col == 2) return 4e-6 * Math.pow(3, this.pxu[2][2]);
			else if (col == 3) return 4e-6;
		}
	},
	pxuMult: function(row, col, next=0) {
		if (row == 0) {
			if (col == 0) return Math.pow(2.5, (this.pxu[0][0] + next) * 0.15);
			else if (col == 1) return Math.pow(1.15, this.pxu[0][1] + next);
			else if (col == 2) return Math.pow(1.3, this.pxu[0][2] + next);
			else if (col == 3) return this.reuPower(0, next);
		}
		else if (row == 1) {
			if (col == 0) return Math.pow(1.2, (this.pxu[1][0] + next));
			else if (col == 1) {
				return Math.pow(1.15, (this.pxu[1][1] + next) * Math.max(0, Math.log(player.antimatter) - Math.log(1e-7) + 1));
			}
			else if (col == 2) return Math.pow(0.9, this.pxu[1][2] + next);
			else if (col == 3) return this.pxu[1][3];
		}
		else if (row == 2) {
			if (col == 0) return Math.pow(1.5, (this.pxu[2][0] + next));
			else if (col == 1) return Math.pow(1.01, (this.pxu[2][1] + next) * player.energy / 6e-8);
			else if (col == 2) {
				return Math.pow(1 + 0.15 * (this.pxu[2][2] + next), Math.max(0, (Math.log(player.pxenergy) - Math.log(2e-6) * 1.3)));
			}
		}
	},
	
	// Tab layout stuff
	totalTabs: 6,
	currentTab: 0
}

function switchTab(tab) {
	player.currentTab = tab
}

function updateResources() {
	if (player.matter >= 10) {
		player.unlockedParadox = true;
		player.onOverdrive = true;
	}
	if (player.onOverdrive && player.extraSeconds > 0) {
		player.extraSeconds -= 1 / 20;
	}
	if (player.extraSeconds < 0) {
		player.extraSeconds = 0;
	}
	player.antimatter += player.amRate();
	player.matter += player.mRate();
	player.renergy += player.reGain();
}

function updateHTML() {
	document.getElementById("am").innerText = formatResource(player.antimatter);
	document.getElementById("amps").innerText = formatResource(player.amRate() * 20);
	document.getElementById("amn").innerText = formatResource(player.amNerf());

	document.getElementById("m").innerText = formatResource(player.matter);
	document.getElementById("an1Limit").innerText = formatResource(Math.max(player.matter, player.enResetReq()));
	document.getElementById("an2Limit").innerText = formatResource(Math.max(player.antimatter, player.enResetReq()));
	document.getElementById("mps").innerText = formatResource(player.mRate() * 20);
	document.getElementById("mn").innerText = formatResource(player.mNerf());
	document.getElementById("en").innerText = formatResource(player.energy);
	document.getElementById("ren").innerText = formatResource(player.renergy);
	document.getElementById("enBuff").innerText = formatResource(player.enBuff());
	document.getElementById("enNerf").innerText = formatResource(player.enNerf());
	document.getElementById("enCap").innerText = formatResource(player.enCap());
	document.getElementById("err0").innerText = formatResource(player.enResetReq());
	document.getElementById("err1").innerText = formatResource(player.enResetReq());
	document.getElementById("pe").innerText = formatResource(player.pxenergy);
	for (index in [0, 1, 2]) {
		document.getElementById("muPower" + index).innerText = formatResource(player.muPower(index));
		document.getElementById("muCost" + index).innerText = formatResource(player.muCost(index));
		document.getElementById("muMult" + index).innerText = formatResource(player.muMult(index));
		document.getElementById("muAmount" + index).innerText = player.mu[index];
	}
	for (index in [0, 1]) {
		document.getElementById("reuPower" + index).innerText = formatResource(player.reuPower(index));
		document.getElementById("reuCost" + index).innerText = formatResource(player.reuCost(index));
		document.getElementById("reuMult" + index).innerText = formatResource(player.reuMult(index));
		document.getElementById("reuAmount" + index).innerText = player.reu[index];
	}
	if (player.antimatter >= 1 / 15778476) {
		document.getElementById("percamPB").innerText = formatResource(100 * Math.log(player.antimatter * 15778476) / 726.35687) + '%';
		// This number, X = 726.35687, satisfies exp(X) = Infinity * 15778476.
		document.getElementById("percamPB").style.width = 100 * Math.log(player.antimatter * 15778476) / 726.35687 + '%';
	}
	else {
		document.getElementById("percamPB").innerText = "0.00%";
		document.getElementById("percamPB").style.width = '0%';
	}
	if (player.matter >= 1 / 15778476) {
		document.getElementById("percmPB").innerText = formatResource(100 * Math.log(player.matter * 15778476) / Math.log(15778476 * 10)) + '%';
		document.getElementById("percmPB").style.width = 100 * Math.log(player.matter * 15778476) / Math.log(15778476 * 10) + '%';
	}
	else {
		document.getElementById("percmPB").innerText = "0.00%";
		document.getElementById("percmPB").style.width = '0%';
	}
	for (var i = 0; i < player.totalTabs; i++) {
		if (i != player.currentTab) {
			document.getElementById("tab" + i).classList.add('hidden')
		}
		else {
			document.getElementById("tab" + i).classList.remove('hidden')
		}
	}
	
	// Unlocking Paradox
	if (player.unlockedParadox) {
		document.getElementById("paradoxTabButton").classList.remove("hidden");
		document.getElementById("automationTabButton").classList.remove("hidden");
		document.getElementById("reu1").classList.remove("hidden");
	}
	else {
		document.getElementById("paradoxTabButton").classList.add("hidden");
		document.getElementById("automationTabButton").classList.add("hidden");
		document.getElementById("reu1").classList.add("hidden");
	}
	
	document.getElementById("extras").innerText = formatResource(player.extraSeconds, true);
	for (row in [0, 1, 2]) {
		for (col in [0, 1, 2, 3]) {
			document.getElementById(("pxuCost" + row) + '-' + col).innerText = formatResource(player.pxuCost(row, col));
			if (row != 2 || col != 3) {
				document.getElementById(("pxuMult" + row) + '-' + col).innerText = formatResource(player.pxuMult(row, col), true);
			}
			if (row == 0 || col != 3) {
				document.getElementById(("pxuMultNext" + row) + '-' + col).innerText = formatResource(player.pxuMult(row, col, 1));
			}
		}
	}
}

function formatResource(number, formatNoAs0=false) {
	if (number < 1e-32) {
		if (formatNoAs0) return '0';
		return 'no';
	}
	formatNumber = number;
	prefix = undefined;
	tfDigits = 3;
	result = '';
	if (number < 1e-31) {
		formatNumber = number * 1e30;
		tfDigits = 1;
		prefix = 'q';
	}
	else if (number < 1e-30) {
		formatNumber = number * 1e30;
		tfDigits = 2;
		prefix = 'q';
	}
	else if (number < 1e-27) {
		formatNumber = number * 1e30;
		prefix = 'q';
	}
	else if (number < 1e-24) {
		formatNumber = number * 1e27;
		prefix = 'r';
	}
	else if (number < 1e-21) {
		formatNumber = number * 1e24;
		prefix = 'y';
	}
	else if (number < 1e-18) {
		formatNumber = number * 1e21;
		prefix = 'z';
	}
	else if (number < 1e-15) {
		formatNumber = number * 1e18;
		prefix = 'a';
	}
	else if (number < 1e-12) {
		formatNumber = number * 1e15;
		prefix = 'f';
	}
	else if (number < 1e-9) {
		formatNumber = number * 1e12;
		prefix = 'p';
	}
	else if (number < 1e-6) {
		formatNumber = number * 1e9;
		prefix = 'n';
	}
	else if (number < 1e-3) {
		formatNumber = number * 1e6;
		prefix = 'u';
	}
	else if (number < 1e-2) {
		formatNumber = number * 1e3;
		prefix = 'm';
	}
	else if (number < 1e-1) {
		tfDigits = 1;
	}
	else if (number < 1) {
		tfDigits = 2;
	}
	else if (number > 1e12) {
		formatNumber = number / 1e12;
		prefix = 'T';
	}
	else if (number > 1e9) {
		formatNumber = number / 1e9;
		prefix = 'B';
	}
	else if (number > 1e6) {
		formatNumber = number / 1e6;
		prefix = 'M';
	}
	else if (number > 1000) {
		formatNumber = number / 1e3;
		prefix = 'K';
	}
	result = formatNumber.toPrecision(tfDigits);
	if (prefix !== undefined) {
		result += ' ' + prefix;
	}
	return result;
}

setInterval(() => {
	updateResources();
	updateHTML();
}, 1000 / 20);

function buyMu(index) {
	let cost = player.muCost(index);
	if (player.matter >= cost) {
		player.matter -= cost;
		player.mu[index]++;
		return true;
	}
	return false;
}

function maxMu(index) {
	while (buyMu(index)) {}
}

function buyReu(index) {
	let cost = player.reuCost(index);
	if (player.renergy >= cost) {
		player.renergy -= cost;
		player.reu[index]++;
		return true;
	}
	return false;
}

function maxReu(index) {
	while (buyReu(index)) {}
}

function annihilate(mode) {
	if (mode == 0 && (player.antimatter >= Math.max(player.matter, player.enResetReq()))) {
		player.antimatter = 0;
		player.energy += player.matter * player.pxuMult(1, 0);
	}
	else if (mode == 1 && (player.matter >= Math.max(player.antimatter, player.enResetReq()))) {
		player.matter = 0;
		player.energy += player.antimatter * player.pxuMult(1, 0);
	}
	if (player.energy >= player.enCap()) {
		player.energy = player.enCap();
	}
}

function pxReset() {
	if (player.matter >= 10 && player.energy >= 2e-6) {
		player.antimatter = 0;
		player.matter = 0;
		player.mu = [0, 0, 0];
		player.pxenergy += player.energy;
		player.energy = 0;
		player.renergy = 0;
		player.reu = [0, 0];
		player.extraSeconds = player.maxExtraSeconds();
		player.onOverdrive = false;
	}
}

function buyPxu(row, col) {
	if (player.pxu[2][3] != 0 && row == 2 && col == 3) return false;
	let cost = player.pxuCost(row, col);
	if (player.pxenergy >= cost) {
		player.pxenergy -= cost;
		player.pxu[row][col]++;
		if (row == 1 && col == 3) {
			player.extraSeconds++;
		}
		if (row == 2 && col == 3) {
			document.getElementById("pu23").classList.add("maxed");
		}
		return true;
	}
	return false;
}

function maxMu(row, col) {
	while (buyMu(row, col)) {}
}