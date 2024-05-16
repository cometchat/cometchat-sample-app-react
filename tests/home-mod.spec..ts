import { test, expect } from '@playwright/test';


test('Check Home page has title', async ({ page }) => {
  await page.goto('localhost:3000/home');

  await expect(page).toHaveTitle("CometChat React Sample App");
});


// === < Conversations COMPONENTS > ===

test('Check if "Chats" exists', async ({ page }) => {
  await page.goto('localhost:3000/home/chats-module');

  const ChatComponent = page.getByText(/Chats/);

  expect(ChatComponent).toBeTruthy();
});

test('Check if "Chats" Components exists', async ({ page }) => {
  await page.goto('localhost:3000/home');

  const CWMComponent = page.getByText("conversations With Messages");
  const ConversationComponent = page.getByText("Conversations");
  const Contacts = page.getByText("Contacts");

  expect(ConversationComponent).toBeTruthy();
  expect(CWMComponent).toBeTruthy();
  expect(Contacts).toBeTruthy();
});


// === < Calls COMPONENTS > ===

test('Check if "Calls" exists', async ({ page }) => {
  await page.goto('localhost:3000/home/chats-module');

  const ChatComponent = page.getByText(/Calls/);

  expect(ChatComponent).toBeTruthy();
});

test('Check if "Calls" Components exists', async ({ page }) => {
  await page.goto('localhost:3000/home/calls-module');

  const CallButtons = page.getByText("call buttons");
  const CallLogs = page.getByText("call logs");
  const CallLogDetails = page.getByText("call log details");
  const CallLogHistory = page.getByText("call log history");
  const CallLogParticipants = page.getByText("call log participants");
  const CallLogRecordings = page.getByText("call log recordings");
  const CallLogsWithDetails = page.getByText("call logs with details");

  expect(CallButtons).toBeTruthy();
  expect(CallLogs).toBeTruthy();
  expect(CallLogDetails).toBeTruthy();
  expect(CallLogHistory).toBeTruthy();
  expect(CallLogParticipants).toBeTruthy();
  expect(CallLogRecordings).toBeTruthy();
  expect(CallLogsWithDetails).toBeTruthy();
});


// === < Messages COMPONENTS > ===

test('Check if "Messages" exists', async ({ page }) => {
  await page.goto('localhost:3000/home/chats-module');

  const ChatComponent = page.getByText(/Messages/);

  expect(ChatComponent).toBeTruthy();
});

test('Check if "Messages" Components exists', async ({ page }) => {
  await page.goto('localhost:3000/home/messages-module');

  const Messages = page.getByText("messages");
  const MessagesHeader = page.getByText("message header");
  const MessagesList = page.getByText("message list");
  const MessagesComposer = page.getByText("message composer");
  const MessagesInfo = page.getByText("message information");


  expect(Messages).toBeTruthy();
  expect(MessagesHeader).toBeTruthy();
  expect(MessagesList).toBeTruthy();
  expect(MessagesComposer).toBeTruthy();
  expect(MessagesInfo).toBeTruthy();
});