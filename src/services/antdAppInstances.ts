import type { NotificationInstance } from "antd/es/notification/interface";
import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";

type AppInstances = {
  notification: NotificationInstance;
  message: MessageInstance;
  modal: ModalStaticFunctions;
};

let instances: AppInstances | null = null;

const setAppInstances = (app: AppInstances) => {
  instances = app;
};

const getNotification = (): NotificationInstance => {
  if (!instances?.notification) {
    throw new Error("Notification instance not set. Wrap your app with <App>.");
  }
  return instances.notification;
};

const getMessage = (): MessageInstance => {
  if (!instances?.message) {
    throw new Error("Message instance not set. Wrap your app with <App>.");
  }
  return instances.message;
};

const getModal = (): ModalStaticFunctions => {
  if (!instances?.modal) {
    throw new Error("Modal instance not set. Wrap your app with <App>.");
  }
  return instances.modal;
};

export {
    setAppInstances,
    getNotification,
    getMessage,
    getModal
}