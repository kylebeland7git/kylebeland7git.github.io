
const formElement = document.getElementById("form");
const coursesElement = document.getElementById("courses");
const addCourseButton = document.getElementById("addCourse");
const clearButton = document.getElementById("clearForm");

// Add a new course.
function addCourse() {
    const course = document.createElement("div");
    course.className = "course";

    course.innerHTML = `
        <label>Department:</label>
        <input type="text" name="department[]" placeholder="ITIS">

        <label>Course Number:</label>
        <input type="text" name="courseNumber[]" placeholder="3135">

        <label>Course Name:</label>
        <input type="text" name="courseTitle[]" placeholder="Course name">

        <label>Reason:</label>
        <textarea name="reason[]" placeholder="Reason for taking course"></textarea>
    `;

    addDeleteButton(course);
    coursesElement.appendChild(course);
}

// Add a delete button beside a course.
function addDeleteButton(course) {
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete Course";

    deleteButton.addEventListener("click", function () {
        course.remove();
    });

    course.appendChild(deleteButton);
}

// Add a course when clicked.
addCourseButton.addEventListener("click", addCourse);

// Add delete buttons to existing courses.
coursesElement.querySelectorAll(".course").forEach(function (course) {
    addDeleteButton(course);
});

// Clear all form fields.
clearButton.addEventListener("click", function () {
    formElement.querySelectorAll("input, textarea").forEach(function (field) {
        field.value = "";
    });

    const firstCourse = coursesElement.querySelector(".course");

    coursesElement.innerHTML = "";

    if (firstCourse) {
        firstCourse.querySelectorAll("input, textarea").forEach(function (field) {
            field.value = "";
        });

        coursesElement.appendChild(firstCourse);
        addDeleteButton(firstCourse);
    }
});


formElement.addEventListener("reset", function () {
    setTimeout(function () {
        const courseRows = coursesElement.querySelectorAll(".course");

        courseRows.forEach(function (course, index) {
            if (index > 0) {
                course.remove();
            }
        });
    }, 0);
});


formElement.addEventListener("submit", function (event) {
    event.preventDefault();

    // Check required information.
    if (!formElement.reportValidity()) {
        return;
    }

    
    const formData = new FormData(formElement);

    const firstName = formData.get("firstName");
    const middleName = formData.get("middleName");
    const nickname = formData.get("nickname");
    const lastName = formData.get("lastName");

    const name = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ");

    const displayName = nickname
        ? firstName + " (" + nickname + ") " + lastName
        : name;

    
    const departments = formData.getAll("department[]");
    const numbers = formData.getAll("courseNumber[]");
    const titles = formData.getAll("courseTitle[]");
    const reasons = formData.getAll("reason[]");

    let courseHTML = "";

    for (let i = 0; i < departments.length; i++) {
        if (!departments[i] && !numbers[i] && !titles[i] && !reasons[i]) {
            continue;
        }

        courseHTML += `
            <li>
                <h4>${departments[i]} ${numbers[i]} - ${titles[i]}</h4>
                <p>${reasons[i]}</p>
            </li>
        `;
    }

    
    const pictureUpload = document.getElementById("pictureUpload");
    const pictureFile = pictureUpload.files[0];

    const picture = pictureFile
        ? URL.createObjectURL(pictureFile)
        : formData.get("picture");

    const pictureAlt = formData.get("pictureAlt");
    const caption = formData.get("caption");

    // Collect links.
    const links = [
        ["Webspace", "webspace"],
        ["GitHub", "github"],
        ["GitHub Pages", "githubPages"],
        ["freeCodeCamp", "freecodecamp"],
        ["LinkedIn", "linkedin"]
    ];

    let linksHTML = "";

    links.forEach(function (link) {
        const url = formData.get(link[1]);

        if (url) {
            linksHTML += `<li><a href="${url}">${link[0]}</a></li>`;
        }
    });

    
    const main = document.querySelector("main");

    main.innerHTML = `
        <h2>Introduction Form</h2>

        <h1>${displayName}</h1>

        <h3>${formData.get("adjectives")} ${formData.get("animal")}</h3>

        <figure>
            <img src="${picture}" alt="${pictureAlt}">
            <figcaption>${caption}</figcaption>
        </figure>

        <p>${formData.get("personalStatement")}</p>

        <h3>Personal Background</h3>
        <p>${formData.get("personalBackground")}</p>

        <h3>Professional Background</h3>
        <p>${formData.get("professionalBackground")}</p>

        <h3>Academic Background</h3>
        <p>${formData.get("academicBackground")}</p>

        <h3>Primary Work Computer</h3>
        <p>${formData.get("primaryWorkComputer")}</p>

        <h3>Primary Work Location</h3>
        <p>${formData.get("primaryWorkLocation")}</p>

        <h3>Alternate Computer Location</h3>
        <p>${formData.get("alternateComputerLocation")}</p>

        <h3>Courses</h3>
        <ul>${courseHTML}</ul>

        <blockquote>${formData.get("quote")}</blockquote>
        <p>${formData.get("quoteAuthor")}</p>

        ${formData.get("funnyItem") ? `<p>${formData.get("funnyItem")}</p>` : ""}

        ${formData.get("somethingToShare") ? `<p>${formData.get("somethingToShare")}</p>` : ""}

        <h3>Links</h3>
        <ul>${linksHTML}</ul>

        <button type="button" id="resetIntroduction">Create Another Introduction</button>
    `;


    document.getElementById("resetIntroduction").addEventListener("click", function () {
        location.reload();
    });
});
