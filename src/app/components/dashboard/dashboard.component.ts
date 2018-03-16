import { Component, AfterViewInit } from '@angular/core';
import * as Chart from '../../../assets/js/Chart.js';
import {title_winners} from '../../data/title';
import {highest_individual} from '../../data/highest_individual';
import {most_sixes} from '../../data/most_sixes';
import {orange_cap} from '../../data/orange_cap';
import {purple_cap} from '../../data/purple_cap';
import {most_runs} from '../../data/top_10_batsmen';
import {most_wickets} from '../../data/top_10_bowlers';
import {Router} from '@angular/router';

@Component({
    selector : 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {
    contextElement: any;
    titles = title_winners;
    colors = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#339966","#ffce56","#dd6954","#4b4bb6","#399ca7"];
 
    ngAfterViewInit() {
        this.displayTitleWinners();
        this.displayTopBatsmen();
        this.displayTopBowlers();
        this.displayOrangeCapWinners();
        this.displayPurpleCapWinners();
        this.displayMostSixes();
        this.displayHighestIndividual();
    }

    displayTitleWinners() {
        const winnerData = [];

        for (const winner of title_winners) {
            if (winnerData[winner.Team_Name]) {
                winnerData[winner.Team_Name]++;
            } else {
                winnerData[winner.Team_Name] = 1;
            }
        }

        this.contextElement = document.getElementById('winners_chart');
        const ctx = this.contextElement.getContext('2d');
        const colors = [
            'rgba(0,0,255, 1)',
            'rgba(51, 153, 102, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(48,48,48,1)',
            'rgba(0,0,153,1)',
            'rgba(255, 99, 71,1)'
        ];
        this.displayChart(ctx, 'doughnut', Object.keys(winnerData),  Object.values(winnerData), '# of titles', colors);
    }

    displayTopBatsmen() {
        const labels = [];
        const data = [];
        for (const player of most_runs) {
            data.push(player.Runs);
            labels.push(player.Player_Name);
        }

        this.contextElement = document.getElementById('topBatsmen_chart');
        const ctx = this.contextElement.getContext('2d');
        this.displayChart(ctx, 'polarArea', labels, data, '# of Runs', this.colors);
    }

    displayOrangeCapWinners() {
        const labels = [];
        const data = [];
        for (const player of orange_cap) {
            data.push(player.Runs);
            labels.push(player.Player_Name + ' (' + player.Season_Year +')');
        }

        this.contextElement = document.getElementById('orangeCap_chart');
        const ctx = this.contextElement.getContext('2d');
        this.displayChart(ctx, 'bar', labels, data, '# of Runs', this.colors);
    }

    displayTopBowlers() {
        const labels = [];
        const data = [];
        for (const player of most_wickets) {
            data.push(player.Wickets);
            labels.push(player.Player_Name);
        }

        this.contextElement = document.getElementById('topBowlers_chart');
        const ctx = this.contextElement.getContext('2d');
        this.displayChart(ctx, 'polarArea', labels, data, '# of wickets', this.colors.reverse());
    }

    displayPurpleCapWinners() {
        const labels = [];
        const data = [];
        for (const player of purple_cap) {
            data.push(player.Wickets);
            labels.push(player.Player_Name + ' (' + player.Season_Year +')');
        }

        this.contextElement = document.getElementById('purpleCap_chart');
        const ctx = this.contextElement.getContext('2d');
        this.displayChart(ctx, 'bar', labels, data, '# of Wickets', this.colors);
    }

    displayMostSixes() {
        const labels = [];
        const data = [];
        for (const player of most_sixes) {
            data.push(player.Sixes);
            labels.push(player.Player_Name);
        }

        this.contextElement = document.getElementById('mostSixes_chart');
        const ctx = this.contextElement.getContext('2d');
        this.displayChart(ctx, 'bar', labels, data, '# of Sixes', this.colors);
    }

    displayHighestIndividual() {
        const labels = [];
        const data = [];
        for (const player of highest_individual) {
            data.push(player.Runs);
            labels.push(player.Player_Name);
        }

        this.contextElement = document.getElementById('individualHighest_chart');
        const ctx = this.contextElement.getContext('2d');
        this.displayChart(ctx, 'bar', labels, data, '# of Runs', this.colors);
    }

    displayChart(ctx, type, labels, data, dataLabel, bgColor) {
        const myChart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: dataLabel,
                    data: data,
                    backgroundColor: bgColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                display: true
            }
        });
    }
}
