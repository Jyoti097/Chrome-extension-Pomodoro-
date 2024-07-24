let seconds = 25 * 60;
let timerIsRunning = false;

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!timerIsRunning) {
    return;
  }

  seconds--;

  const minLeft = Math.floor(seconds / 60) + "M";
  chrome.action.setBadgeText(
    {
      text: minLeft,
    },
    () => {}
  );

  if (seconds <= 0) {
    clearAlarm("pomodoro-timer");
    createNotification("Well Done!! You focused well. Take a break!!");
    chrome.contextMenus.update("start-timer", {
      title: "Start Timer",
      contexts: ["all"],
    });

    chrome.action.setBadgeText(
      {
        text: "_",
      },
      () => {}
    );

    chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => {});
  }
});

function createNotification(message) {
  const opt = {
    type: "list",
    title: "Pomodoro Timer",
    message,
    items: [{ title: "Pomodoro Timer", message: message }],
    iconUrl: "icons/clock-48.png",
  };

  chrome.notifications.create(opt);
}

function createAlarm(name) {
  chrome.alarms.create(name, {
    periodInMinutes: 1 / 60,
  });
}

function clearAlarm(name) {
  chrome.alarms.clear(name, (wasCleared) => {
    console.log(wasCleared);
  });
}

chrome.contextMenus.create({
  id: "start-timer",
  title: "Start Timer",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: "reset-timer",
  title: "Reset Timer",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case "reset-timer":
      chrome.contextMenus.update("start-timer", {
        title: "Start Timer",
        contexts: ["all"],
      });
      chrome.action.setBadgeText(
        {
          text: "R",
        },
        () => {}
      );
      clearAlarm("pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({ color: "green" }, () => {});
      createNotification("Your Timer has been Reset");
      timerIsRunning = false;
      seconds = 0;
      break;

    case "start-timer":
      if (timerIsRunning) {
        // clearAlarm("pomodoro-timer");
        chrome.action.setBadgeText(
          {
            text: "S",
          },
          () => {}
        );

        chrome.action.setBadgeBackgroundColor({ color: "blue" }, () => {});
        createNotification("Your Timer has stopped");
        chrome.contextMenus.update("start-timer", {
          title: "Start Timer",
          contexts: ["all"],
        });
        timerIsRunning = false;
        return;
      }

      seconds = seconds <= 0 ? 25*60 : seconds
      createNotification("Your Timer has started");
      timerIsRunning = true;
      createAlarm("pomodoro-timer");

      chrome.action.setBadgeBackgroundColor({ color: "red" }, () => {});

      chrome.contextMenus.update("start-timer", {
        title: "Stop Timer",
        contexts: ["all"],
      });
      break;

    default:
      break;
  }
});

chrome.action.setBadgeBackgroundColor({ color: "red" }, () => {});
