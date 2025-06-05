let count = 0; // Initial count

// Called when the Increment button is clicked
function increment() {
    count += 1; // Increase by 1
    document.getElementById("count-el").textContent = count; // Update UI
}

// Optional: Reset function for the Reset button
function reset() {
    count = 0;
    document.getElementById("count-el").textContent = count;
}
