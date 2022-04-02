<!--
  <<< Author notes: Header of the course >>>
  Include a 1280×640 image, course name in sentence case, and a concise description in emphasis.
  In your repository settings: enable template repository, add your 1280×640 social image, auto delete head branches.
  Next to "About", add description & tags; disable releases, packages, & environments.
  Add your open source license, GitHub uses Creative Commons Attribution 4.0 International.
-->

<img src="https://repository-images.githubusercontent.com/247808107/d6de8f80-684a-11ea-97d2-5705e8595f0d" width=300 align=right>

# GitHub Actions: Continuous Delivery with Azure

_Create two deployment workflows using GitHub Actions and Microsoft Azure._

<!--
  <<< Author notes: Start of the course >>>
  Include start button, a note about Actions minutes,
  and tell the learner why they should take the course.
  Each step should be wrapped in <details>/<summary>, with an `id` set.
  The start <details> should have `open` as well.
  Do not use quotes on the <details> tag attributes.
-->

<details id=0 open>
<summary><strong>:golf: Start</strong></summary>

**To start this course: [<img width="150" alt="Use this template" src="https://user-images.githubusercontent.com/1221423/148581131-555c0fb8-5361-4450-a760-75fa6219a2fc.png">](https://github.com/TBD-organization/TBD-repository-name/generate)**

> We recommend creating a public repository, as private repositories will [use Actions minutes](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions).<br>
> After you make your own repository, wait about 20 seconds and refresh. I will go to the next step.

- **Who is this for**: Developers, DevOps Engineers, new GitHub users, students, teams.
- **What you'll learn**: We'll learn how to create a workflow that enables Continuous Delivery using GitHub Actions and Microsoft Azure.
- **What you'll build**: We will create two deployment workflows - the first workflow to deploy to staging based on a label and the second workflow to deploy to production based on merging to main.
- **Prerequisites**: Before you start, you should be familiar with GitHub and Continuous Integration.
- **How long**: This course is 11 steps long and takes less than 2 hours to complete.

</details>

<!--
  <<< Author notes: Step 1 >>>
  Choose 3-5 steps for your course.
  The first step is always the hardest, so pick something easy!
  Link to docs.github.com for further explanations.
  Encourage users to open new tabs for steps!
  TBD-step-1-notes.
-->

<details id=1>
<summary><strong>:zap: Step 1: Configure a trigger based on labels</strong></summary>

### Welcome to "GitHub Actions: Continuous Delivery with Azure"! :wave:

**What is _Continuous Delivery_**: [Martin Fowler](https://martinfowler.com/bliki/ContinuousDelivery.html) defined Continuous Delivery very simply in a 2013 post as follows:

>Continuous Delivery is a software development discipline where you build software in >such a way that the software can be released to production at any time.

A lot of things go into delivering "continuously". These things can range from culture and behavior to specific automation. In this course, we're going to focus on deployment automation.

### :keyboard: Activity: Configure a trigger based on labels
In a GitHub Actions workflow, the `on` step defines what causes the workflow to run. In this case, we want the workflow to run whenever a label is applied to the pull request.

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
1. TBD-step-1-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Step 2 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-2-notes.
-->

<details id=2>
<summary><strong>:dart: Step 2: Trigger a job on specific labels</strong></summary>

### You configured a trigger based on labels! :tada:

TBD-step-2-information

**What is _TBD-term-2_**: TBD-definition-2

### :keyboard: Activity: Trigger a job on specific labels

1. TBD-step-2-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Step 3 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-3-notes.
-->

<details id=3>
<summary><strong>:wrench: Step 3: Set up the environment for your app</strong></summary>

### Nice work finishing TBD-step-2-name :sparkles:

TBD-step-3-information

**What is _TBD-term-3_**: TBD-definition-3

### :keyboard: Activity: TBD-step-3-name

1. TBD-step-3-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Step 4 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-4-notes.
-->

<details id=4>
<summary><strong>:arrow_lower_right: Step 4: Merge the staging workflow</strong></summary>

### Nicely done TBD-step-3-name! :partying_face:

TBD-step-4-information

**What is _TBD-term-4_**: TBD-definition-4

### :keyboard: Activity: TBD-step-4-name

1. TBD-step-4-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>


<!--
  <<< Author notes: Step 5 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-5-notes.
-->

<details id=5>
<summary><strong>:cyclone: Step 5: Spin up, configure, and destroy Azure resources</strong></summary>

### Nicely done! :partying_face:

TBD-step-5-information

**What is _TBD-term-5_**: TBD-definition-5

### :keyboard: Activity: TBD-step-5-name

1. TBD-step-5-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>
...
<!--
  <<< Author notes: Step 10 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-5-notes.
-->
<details id=10>
<summary><strong>:shipit: Step 10: Merge the production workflow</strong></summary>

### Almost there TBD-step-9-name! :heart:

You can now [merge](https://docs.github.com/en/get-started/quickstart/github-glossary#merge) your pull request!

### :keyboard: Activity: Merge your pull request

1. Click **Merge pull request**.
1. Delete the branch `TBD-branch-name` (optional).
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Finish >>>
  Review what we learned, ask for feedback, provide next steps.
-->

<details id=X>
<summary><strong>:checkered_flag: Finish</strong></summary>

### Congratulations friend, you've completed this course!

<img src=TBD-celebrate-image alt=celebrate width=300 align=right>

Here's a recap of all the tasks you've accomplished in your repository:

- TBD-recap.

### What's next?

- TBD-continue.
- [We'd love to hear what you thought of this course](TBD-feedback-link).
- [Take another TBD-organization Course](https://github.com/TBD-organization).
- [Read the GitHub Getting Started docs](https://docs.github.com/en/get-started).
- To find projects to contribute to, check out [GitHub Explore](https://github.com/explore).

</details>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: [TBD-support](TBD-support-link) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2022 TBD-copyright-holder &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [CC-BY-4.0 License](https://creativecommons.org/licenses/by/4.0/legalcode)
