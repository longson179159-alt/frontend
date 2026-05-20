<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto max-w-3xl px-6 py-12">
      <h1 class="text-3xl font-bold">Privacy Policy</h1>
      <p class="mt-3 text-sm text-gray-500">Last updated: May 20, 2026</p>

      <div class="mt-8 space-y-8 leading-7">
        <section>
          <h2 class="text-xl font-semibold">Overview</h2>
          <p class="mt-2">
            Langoda provides a Chrome extension and web application that help users create
            language-learning lessons from webpage text and YouTube subtitles.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">What data the extension processes</h2>
          <p class="mt-2">
            When you use the Langoda Chrome extension, the extension may process:
          </p>
          <ul class="mt-3 list-disc space-y-2 pl-6">
            <li>Text that you select on a webpage</li>
            <li>Main readable text extracted from the current webpage</li>
            <li>YouTube subtitle text for the current video when captions are available</li>
            <li>The current page title and limited page URL context needed to match a YouTube video</li>
            <li>Temporary extension storage data used to complete subtitle import</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold">How we use this data</h2>
          <p class="mt-2">
            Langoda uses this data only to support the core function of the extension:
            creating lessons in your Langoda account from webpage content or YouTube subtitles.
          </p>
          <ul class="mt-3 list-disc space-y-2 pl-6">
            <li>Create a new lesson in your account</li>
            <li>Associate imported content with the correct YouTube video when needed</li>
            <li>Support login state and lesson creation through the Langoda backend</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold">How data is transmitted</h2>
          <p class="mt-2">
            When you confirm an import action, the extension sends the relevant text or subtitle
            data to the Langoda backend over HTTPS so a lesson can be created in your account.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">Local browser storage</h2>
          <p class="mt-2">
            The extension stores temporary data in Chrome local storage, such as the latest
            captured YouTube subtitle request URL and related video information, so the popup
            can complete subtitle import correctly.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">Data sharing</h2>
          <p class="mt-2">
            Langoda does not sell user data. Langoda does not use or transfer user data for
            advertising, credit evaluation, lending, or any purpose unrelated to the extension's
            core lesson-creation function.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">Data retention</h2>
          <p class="mt-2">
            Data sent to the Langoda backend may be retained as part of your lesson content and
            account records. Temporary local extension data may remain in browser storage until
            it is replaced or cleared.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">Your choices</h2>
          <p class="mt-2">
            You control when the extension imports content. You can stop using the extension at
            any time, remove the extension from Chrome, or contact Langoda if you have questions
            about your data.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold">Contact</h2>
          <p class="mt-2">
            If you have privacy questions, contact:
            <a
              href="mailto:longson179159@gmail.com"
              class="text-blue-600 underline"
            >
              longson179159@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  </main>
</template>