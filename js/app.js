var app = angular.module("myapp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "templates/welcome.html?v=2", controller: "WelcomeCtrl" })
        .when("/events", { templateUrl: "templates/events.html?v=2", controller: "EventCtrl" })
        .when("/event/:id", { templateUrl: "templates/event-detail.html?v=2", controller: "EventDetailCtrl" })
        .when("/bookings", { templateUrl: "templates/bookings.html?v=2", controller: "BookingCtrl" })
        .when("/calendar", { templateUrl: "templates/calendar.html?v=2", controller: "CalendarCtrl" })
        .otherwise({ redirectTo: "/" });
});

// Event Service with hardcoded database arrays
app.factory("EventService", function() {
    var list = [
        {id: 1, name: "Global Tech Summit", date: "2026-07-15", location: "Bangalore", capacity: 100, booked: 0, price: 500, category: "Tech", description: "AI news updates."},
        {id: 2, name: "Jazz under the Stars", date: "2026-07-22", location: "Mysore", capacity: 80, booked: 0, price: 750, category: "Music", description: "Jazz outdoor music."},
        {id: 3, name: "Food Carnival", date: "2026-07-29", location: "Chennai", capacity: 50, booked: 0, price: 300, category: "Food", description: "Food trucks culinary treats."}
    ];
    return {
        get: () => list,
        getById: id => list.find(e => e.id == id)
    };
});

// Booking Service handling confirmed tickets
app.factory("BookingService", function() {
    var bookings = [];
    return {
        get: () => bookings,
        book: (event, name, email, qty) => {
            event.booked += qty;
            bookings.push({
                id: "BKG" + Math.floor(100 + Math.random() * 900), event: event,
                eventName: event.name, eventDate: event.date, name: name, email: email, tickets: qty, total: event.price * qty
            });
        },
        cancel: b => { b.event.booked -= b.tickets; bookings.splice(bookings.indexOf(b), 1); }
    };
});

// Controllers Section
app.controller("WelcomeCtrl", function($scope) {});

app.controller("EventCtrl", function($scope, EventService) {
    $scope.events = EventService.get();
});

app.controller("EventDetailCtrl", function($scope, $routeParams, $location, EventService, BookingService) {
    $scope.event = EventService.getById($routeParams.id);
    $scope.tickets = 1;
    $scope.isFuture = d => new Date(d) >= new Date().setHours(0,0,0,0);
    $scope.book = () => {
        BookingService.book($scope.event, $scope.name, $scope.email, $scope.tickets);
        alert("Booking Confirmed!");
        $location.path("/bookings");
    };
});

app.controller("BookingCtrl", function($scope, BookingService) {
    $scope.bookings = BookingService.get();
    $scope.cancel = b => confirm("Cancel booking " + b.id + "?") && (BookingService.cancel(b), alert("Cancelled"));
});

app.controller("CalendarCtrl", function($scope, EventService) {
    $scope.calendarDays = [];
    for (var d = 1; d <= 31; d++) {
        var dateStr = "2026-07-" + (d < 10 ? "0" + d : d);
        var dayEvents = EventService.get().filter(e => e.date === dateStr);
        $scope.calendarDays.push({ day: d, events: dayEvents });
    }
});