$(document).ready(async () => {
    let word_centrality_measures = await d3.json('data/word_centrality_measures.json');

    let BarPublicationCount = new Chart(
        document.getElementById('BarPublicationCount'), {
            type: 'bar',
            data: {
                labels: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
                datasets: [
                    {
                        label: 'Documents',
                        data: [3,2,6,6,27,26,27,9],
                        backgroundColor: '#447695',
                    },
                    {
                        label: 'Speech',
                        data: [6,5,20,45,81,88,14,12],
                        backgroundColor: '#433D64',
                    },
                    {
                        label: 'Parliamentary Q&A',
                        data: [0, 2, 3, 7, 11, 9, 15, 8],
                        backgroundColor: '#59B3A3',
                    },
                ]
            },
            options: {
                aspectRatio: 1.2,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Count of publications by type'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
                },
            },
        }
    );

    let BarOrgCount = new Chart(
        document.getElementById('BarOrgCount'), {
            type: 'bar',
            data: {
                labels: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
                datasets: [
                    {
                        label: 'Organisations',
                        data: [6,8,13,18,21,29,26,14],
                        backgroundColor: '#447695',
                    },
                ]
            },
            options: {
                aspectRatio: 1.2,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Count of participating offices by year'
                    },
                    legend: {
                        display: false
                    },
                },
            },
        }
    );

    let BarOrgType = new Chart(
        document.getElementById('BarOrgType'), {
            type: 'bar',
            data: {
                labels: ['Accounting And Corporate Regulatory Authority',
                'Building And Construction Authority',
                'Centre for Liveable Cities',
                'Civil Aviation Authority Of Singapore',
                'Competition And Consumer Commission Of Singapore',
                'Defence Science And Technology Agency',
                'Economic Development Board',
                'Government Technology Agency',
                'Health Sciences Authority',
                'Housing & Development Board',
                'Infocomm Development Authority of Singapore',
                'Intellectual Property Office Of Singapore',
                'Majlis Ugama Islam Singapura',
                'Maritime And Port Authority Of Singapore',
                'Ministry Of Communications And Information',
                'Ministry Of Defence',
                'Ministry Of Education',
                'Ministry Of Finance',
                'Ministry Of Foreign Affairs',
                'Ministry Of Health',
                'Ministry Of Home Affairs',
                'Ministry Of Law',
                'Ministry Of Manpower',
                'Ministry Of National Development',
                'Ministry Of Social And Family Development',
                'Ministry Of Trade And Industry',
                'Ministry Of Transport',
                'Monetary Authority Of Singapore',
                'National Environment Agency',
                'Personal Data Protection Commission',
                "Prime Minister's Office",
                'Singapore Tourism Board',
                'Smart Nation and Digital Government Office',
                'Urban Redevelopment Authority']
               ,
                datasets: [
                    {
                        label: 'Documents',
                        data: [2,4,13,1,2,1,2,10,4,1,25,10,0,6,0,0,0,4,0,0,0,0,0,2,0,5,1,1,1,2,0,3,5,1],
                        backgroundColor: '#447695',
                    },
                    {
                        label: 'Speech',
                        data: [1,0,2,0,0,0,0,4,0,0,16,0,1,6,32,26,21,14,9,11,4,11,3,8,1,23,10,16,0,8,19,0,22,3],
                        backgroundColor: '#433D64',
                    },
                    {
                        label: 'Parliamentary Q&A',
                        data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,7,2,1,3,3,2,1,0,3,0,5,8,3,0,0,1,0,6,0],
                        backgroundColor: '#59B3A3',
                    },
                ]
            },
            options: {
                indexAxis: 'y',
                aspectRatio: 0.4,
                maintainAspectRatio: false,
                scales: {
                    y: {
                       ticks: {
                           autoSkip: false
                       } 
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Count of publications by each office'
                    },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    },
                },
            },
        }
    );

    let ScatterWordCentrality = new Chart(
        document.getElementById('ScatterWordCentrality'), {
            plugins: [ChartDataLabels],
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Words',
                        data: word_centrality_measures.map(d => ({x: d.betweenness_centrality_log, y: d.closeness_centrality, title: d.Id})),
                        borderColor: '#447695',
                        backgroundColor: '#447695',
                        pointRadius: 2,
                    }
                ]
            },
            options: {
                aspectRatio: .8,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'log betweenness centrality'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'closeness centrality'
                        },
                    }
                },
                plugins: {
                    datalabels: {
                        anchor: 'center',
                        align: 'right',
                        offset: 2,
                        font: {
                            size: 8,
                        },
                        color: 'rgba(1,1,1,0.5)',
                        clip: false,
                        formatter: (value, context) => {
                            return context.dataset.data[context.dataIndex].title;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Keywords by centrality measures'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.data[context.dataIndex].title;
                            }
                        }
                    }
                },
            },
        }
    );
});