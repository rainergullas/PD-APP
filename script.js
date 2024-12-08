// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDDZ9mquEwIuz1kXiqUwghPJHQFsUEBido",
    authDomain: "softdes-webapp.firebaseapp.com",
    projectId: "softdes-webapp",
    storageBucket: "softdes-webapp.firebasestorage.app",
    messagingSenderId: "1012676348455",
    appId: "1:1012676348455:web:191c588860fc86294e1c02",
    measurementId: "G-EHTH0EEJSX"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// DOM Elements
const totalInspections = document.getElementById('total-inspections');
const defectiveItems = document.getElementById('defective-items');
const efficiencyRate = document.getElementById('efficiency-rate');

// Initialize Charts
const barCtx = document.getElementById('bar-chart').getContext('2d');
const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Inspections',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        }
    }
});

const pieCtx = document.getElementById('pie-chart').getContext('2d');
const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Scratch', 'Crack', 'Warping', 'Other'],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        }
    }
});

// Fetch data from Firestore
async function fetchFirestoreData() {
    const q = query(collection(db, "wood_inspections"));
    const querySnapshot = await getDocs(q);
    
    let totalInspectionsCount = 0;
    let defectiveItemsCount = 0;
    let inspectionTrends = [0, 0, 0, 0, 0]; // Monthly inspection data
    let defectsByType = [0, 0, 0, 0]; // Scratch, Crack, Warping, Other

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalInspectionsCount += data.wood_count;
        defectiveItemsCount += (data.defect_type !== "None") ? 1 : 0;
        
        // Update the inspection trends (dummy logic for now)
        const monthIndex = new Date(data.timestamp).getMonth();
        inspectionTrends[monthIndex] += data.wood_count;
        
        // Update defects by type (dummy logic for now)
        switch (data.defect_type) {
            case "Scratch":
                defectsByType[0] += 1;
                break;
            case "Crack":
                defectsByType[1] += 1;
                break;
            case "Warping":
                defectsByType[2] += 1;
                break;
            default:
                defectsByType[3] += 1;
                break;
        }
    });

    // Update the DOM with the fetched data
    totalInspections.textContent = totalInspectionsCount;
    defectiveItems.textContent = defectiveItemsCount;
    efficiencyRate.textContent = `${((defectiveItemsCount / totalInspectionsCount) * 100).toFixed(2)}%`;

    // Update the charts with new data
    barChart.data.datasets[0].data = inspectionTrends;
    barChart.update();

    pieChart.data.datasets[0].data = defectsByType;
    pieChart.update();
}

// Call fetchFirestoreData to populate the initial data
fetchFirestoreData();
