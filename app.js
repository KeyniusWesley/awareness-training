const topics = [
  {
    kicker: "Topic 1",
    title: "People Are the First Attack Surface",
    duration: "2 min",
    summary:
      "Most security incidents start with a normal human moment: rushing, trusting too quickly, sending too fast, or staying silent after a mistake.",
    explanation:
      "Security is not only a technical control. It is daily behavior. Attackers look for pressure, habit, distraction, curiosity, and politeness. That is why our strongest defense is not perfect memory. It is stopping, checking, and reporting early.",
    documents: [
      "Keynius SLG Information security policy v1.5",
      "Smart Locking Group security policies v1.2",
      "Security Incident Response Plan v1.0"
    ],
    rules: [
      "Report suspicious situations, suspicious files, and suspected data leaks immediately to the Security Officer.",
      "Use approved work systems and follow the agreed company process, even when under time pressure.",
      "Treat awareness as part of your job: new employees are instructed during onboarding and employees receive ongoing training."
    ],
    risks: [
      "Clicking or forwarding before checking",
      "Trusting urgent requests because the sender looks familiar",
      "Trying to fix a mistake quietly instead of reporting it fast",
      "Choosing convenience over the company process"
    ],
    image: "assets/images/human-risk.svg",
    theme: { primary: "#0044CE", secondary: "#09896D" },
    questions: [
      {
        prompt: "A colleague clicked a suspicious link and closed the page immediately. What should happen next?",
        choices: [
          {
            text: "Run a full malware investigation alone before telling anyone.",
            correct: false,
            feedback: "That delays the right response. The first priority is fast reporting, not a solo investigation."
          },
          {
            text: "Report it immediately, even if nothing obvious happened.",
            correct: true,
            feedback: "Correct. Early reporting gives the Security Officer time to check logs and contain risk."
          },
          {
            text: "Wait and only report if the device becomes slow.",
            correct: false,
            feedback: "Waiting can turn a small event into a larger incident."
          },
          {
            text: "Delete the email and move on.",
            correct: false,
            feedback: "Deleting the email does not remove the risk."
          }
        ]
      },
      {
        prompt: "Why are people targeted so often in attacks?",
        choices: [
          {
            text: "Because habits, urgency, and trust can be exploited faster than systems can react.",
            correct: true,
            feedback: "Correct. Social engineering works by exploiting normal human behavior."
          },
          {
            text: "Because technical controls are illegal in most companies.",
            correct: false,
            feedback: "That is not true. Technical controls matter, but people are still a major entry point."
          },
          {
            text: "Because only managers are targeted.",
            correct: false,
            feedback: "Everyone can be targeted, not only one role."
          },
          {
            text: "Because phishing only works on people with weak passwords.",
            correct: false,
            feedback: "Password quality matters, but human-targeted attacks go much broader than that."
          }
        ]
      },
      {
        prompt: "A request feels unusual, but you cannot prove it is malicious. What is the safest move?",
        choices: [
          {
            text: "Pause, verify, and report the doubt.",
            correct: true,
            feedback: "Correct. Security improves when uncertainty is shared early."
          },
          {
            text: "Continue because there is no proof.",
            correct: false,
            feedback: "Lack of proof is not the same as low risk."
          },
          {
            text: "Ask a colleague quietly but do not report it.",
            correct: false,
            feedback: "Peer input can help, but formal reporting is still important."
          },
          {
            text: "Complete the request first and document your doubt afterwards.",
            correct: false,
            feedback: "If the request is risky, acting first may already create the incident."
          }
        ]
      },
      {
        prompt: "What turns a small human mistake into a bigger security problem most often?",
        choices: [
          {
            text: "Immediately escalating the problem through the correct channel.",
            correct: false,
            feedback: "Fast escalation is exactly what helps contain the situation."
          },
          {
            text: "Delaying the report and hiding the mistake.",
            correct: true,
            feedback: "Correct. Speed of reporting often matters more than the original mistake."
          },
          {
            text: "Talking openly about it immediately.",
            correct: false,
            feedback: "Fast reporting is exactly what reduces impact."
          },
          {
            text: "Following the normal incident process.",
            correct: false,
            feedback: "The process exists to contain damage."
          }
        ]
      },
      {
        prompt: "What is the best attitude for this training?",
        choices: [
          {
            text: "Security is mainly a technical problem and mostly out of your hands.",
            correct: false,
            feedback: "Daily employee behavior is one of the main controls."
          },
          {
            text: "Security is mainly IT's job.",
            correct: false,
            feedback: "Daily staff behavior is part of the control environment."
          },
          {
            text: "If nothing goes wrong today, security is solved.",
            correct: false,
            feedback: "Security awareness is continuous, not one-time."
          },
          {
            text: "Security is shared behavior, not a blame exercise.",
            correct: true,
            feedback: "Correct. The goal is early action and better habits, not blame."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 2",
    title: "Customer Data Must Be Kept Under Control",
    duration: "3 min",
    summary:
      "Customer data becomes dangerous when it stays too long in inboxes, exports, screenshots, local folders, or printed paper.",
    explanation:
      "We only keep customer data for the business purpose we still need. If the work is done, the extra copy should go. The safest file is the one stored only in the approved system, not the one forgotten on a desktop, in Downloads, or near the printer.",
    documents: [
      "Keynius Statement of Applicability v1.1 ENG",
      "Keynius SLG Information security policy v1.5",
      "Smart Locking Group security policies v1.2"
    ],
    rules: [
      "Information stored in systems, devices, or other media should be deleted when it is no longer needed.",
      "No local work files should be stored on the computer; use approved company systems such as SharePoint and OneDrive.",
      "Printed documents must be removed from the printer immediately, and confidential paper must be destroyed safely.",
      "Do not store Smart Locking Group data on a private laptop."
    ],
    risks: [
      "Old exports with names, addresses, or account details staying on local devices",
      "Customer attachments sitting in inboxes long after the task is finished",
      "Printed documents left at printers or on desks",
      "Private storage, screenshots, or copied lists outside the approved system"
    ],
    image: "assets/images/customer-data.svg",
    theme: { primary: "#1582F1", secondary: "#09896D" },
    questions: [
      {
        prompt: "You finished a customer case and still have a local export with personal details. What should you do?",
        choices: [
          {
            text: "Delete the local copy when it is no longer needed and keep the official record only in the approved system.",
            correct: true,
            feedback: "Correct. Extra local copies increase exposure without adding control."
          },
          {
            text: "Keep it on the desktop in case the customer calls again.",
            correct: false,
            feedback: "That keeps data longer than needed and increases risk."
          },
          {
            text: "Send it to your private mailbox for backup.",
            correct: false,
            feedback: "Customer data must not move into personal channels."
          },
          {
            text: "Move it to a USB stick so it is not on the laptop anymore.",
            correct: false,
            feedback: "Moving data to uncontrolled storage does not solve the problem."
          }
        ]
      },
      {
        prompt: "Why is 'just in case' storage a problem?",
        choices: [
          {
            text: "Because storage costs become legally reportable.",
            correct: false,
            feedback: "The main issue is security and privacy risk, not storage cost reporting."
          },
          {
            text: "Because all customer data must be deleted immediately.",
            correct: false,
            feedback: "We keep what is still needed for the business purpose or legal duty."
          },
          {
            text: "Because storage size is the main issue.",
            correct: false,
            feedback: "The main issue is security and privacy exposure."
          },
          {
            text: "Because stale data increases breach impact and is harder to control.",
            correct: true,
            feedback: "Correct. The more copies we keep, the more places data can leak from."
          }
        ]
      },
      {
        prompt: "You print a customer document for a one-time task. What is the correct next step after use?",
        choices: [
          {
            text: "Leave it in the printer tray until the end of the day.",
            correct: false,
            feedback: "Printed customer data should not remain unattended."
          },
          {
            text: "Remove it immediately and shred it if it is no longer needed.",
            correct: true,
            feedback: "Correct. Printed customer data should never remain unattended."
          },
          {
            text: "Leave it near the printer for later.",
            correct: false,
            feedback: "That creates an unnecessary disclosure risk."
          },
          {
            text: "Take it home in your bag.",
            correct: false,
            feedback: "Business documents should not travel without need and control."
          }
        ]
      },
      {
        prompt: "Which storage location is best for active business files?",
        choices: [
          {
            text: "A personal USB stick.",
            correct: false,
            feedback: "Removable media and personal storage introduce unnecessary risk."
          },
          {
            text: "A folder on a private laptop.",
            correct: false,
            feedback: "Private devices are not the approved place for company data."
          },
          {
            text: "The approved company system with controlled access.",
            correct: true,
            feedback: "Correct. Approved business systems offer the best control and traceability."
          },
          {
            text: "A private cloud drive that only you can see.",
            correct: false,
            feedback: "Private cloud storage is not the same as an approved company platform."
          }
        ]
      },
      {
        prompt: "What is the safest habit with customer attachments in email?",
        choices: [
          {
            text: "Keep every attachment forever in your mailbox in case it helps later.",
            correct: false,
            feedback: "Long-term accumulation increases risk and makes control harder."
          },
          {
            text: "Move the needed information into the correct system and remove extra copies when they are no longer needed.",
            correct: true,
            feedback: "Correct. Customer data should not linger in scattered copies."
          },
          {
            text: "Forward attachments to a colleague's private email for safekeeping.",
            correct: false,
            feedback: "Private mail is not an approved control."
          },
          {
            text: "Save all attachments in Downloads because that is easier to search.",
            correct: false,
            feedback: "Local convenience folders often become uncontrolled data stores."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 3",
    title: "Passwords and MFA Protect the Front Door",
    duration: "3 min",
    summary:
      "A strong password process is not about memory. It is about unique credentials, Passbolt, and not sharing access.",
    explanation:
      "Passwords fail when they are reused, written down, shared over chat, or copied into spreadsheets. The company policy is clear: use the password manager, change default passwords at first use, keep credentials personal, and use two-step verification where possible.",
    documents: [
      "Keynius SLG Information security policy v1.5",
      "Smart Locking Group security policies v1.2"
    ],
    rules: [
      "Use a password manager to register and generate passwords; Passbolt is the approved process.",
      "Temporary or default passwords must be replaced at first use.",
      "Passwords are personal and must not be shared, including with colleagues.",
      "Two-step verification should be used wherever possible.",
      "Do not store passwords on paper or in ad hoc files."
    ],
    risks: [
      "Password reuse across tools and accounts",
      "Sharing credentials over WhatsApp, email, or verbally",
      "Writing passwords on sticky notes or notebooks",
      "Weak temporary passwords staying active too long"
    ],
    image: "assets/images/passwords.svg",
    theme: { primary: "#0044CE", secondary: "#19C29D" },
    questions: [
      {
        prompt: "A teammate asks for your password 'just for today'. What is the right answer?",
        choices: [
          {
            text: "No. Use the approved access process instead.",
            correct: true,
            feedback: "Correct. Password sharing removes accountability and increases risk."
          },
          {
            text: "Yes, if you trust the colleague.",
            correct: false,
            feedback: "Trust does not replace policy or traceability."
          },
          {
            text: "Yes, but only through WhatsApp.",
            correct: false,
            feedback: "Side-channel sharing is still password sharing."
          },
          {
            text: "Yes, if you change it back later.",
            correct: false,
            feedback: "Changing it later does not undo the sharing and loss of accountability."
          }
        ]
      },
      {
        prompt: "What is the best setup for a new work account?",
        choices: [
          {
            text: "Reuse your email password to keep things simple.",
            correct: false,
            feedback: "Reuse turns one compromise into many."
          },
          {
            text: "Write the password down until you memorize it.",
            correct: false,
            feedback: "Paper notes are not a secure storage method."
          },
          {
            text: "Generate a unique password in Passbolt and enable MFA if available.",
            correct: true,
            feedback: "Correct. Unique passwords plus MFA create a much stronger baseline."
          },
          {
            text: "Use one shared team password so everyone can help each other.",
            correct: false,
            feedback: "Shared passwords break personal accountability and expand the blast radius."
          }
        ]
      },
      {
        prompt: "Why are shared passwords a security problem?",
        choices: [
          {
            text: "Because you can no longer see who really used the account.",
            correct: true,
            feedback: "Correct. Shared passwords destroy accountability and make incident response harder."
          },
          {
            text: "Because passwords stop working when two people know them.",
            correct: false,
            feedback: "The real problem is exposure and lack of accountability."
          },
          {
            text: "Because only managers may share passwords.",
            correct: false,
            feedback: "The issue is sharing itself, not the job title."
          },
          {
            text: "Because the password manager blocks more than one user automatically.",
            correct: false,
            feedback: "The main issue is control and traceability, not a technical limit."
          }
        ]
      },
      {
        prompt: "What should happen to a default password delivered with software or hardware?",
        choices: [
          {
            text: "It should be changed at first use.",
            correct: true,
            feedback: "Correct. Default passwords should never stay in place."
          },
          {
            text: "It may stay if the device is inside the office.",
            correct: false,
            feedback: "Location does not make a default password safe."
          },
          {
            text: "It should be written down for the team.",
            correct: false,
            feedback: "That adds risk without control."
          },
          {
            text: "It can remain active if MFA is planned later.",
            correct: false,
            feedback: "Future MFA does not justify keeping a known default password."
          }
        ]
      },
      {
        prompt: "Which habit most improves password security day to day?",
        choices: [
          {
            text: "Using one memorable password for everything.",
            correct: false,
            feedback: "One password for everything creates a cascade risk."
          },
          {
            text: "Emailing yourself a list of passwords.",
            correct: false,
            feedback: "Email is not a secure password vault."
          },
          {
            text: "Saving passwords in browser notes and hoping to clean them up later.",
            correct: false,
            feedback: "Security habits should be controlled now, not fixed later."
          },
          {
            text: "Using the password manager every time instead of shortcuts.",
            correct: true,
            feedback: "Correct. The secure habit is the one you use consistently."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 4",
    title: "Lock Your PC Every Time You Step Away",
    duration: "2 min",
    summary:
      "An unlocked screen gives away mail, files, systems, and customer data in seconds.",
    explanation:
      "Clear screen discipline is one of the easiest controls to apply. It protects against accidental access, visitors, shared spaces, and quick misuse. Auto-lock after five minutes is a backup. The main rule is simple: if you stand up, you lock your screen.",
    documents: [
      "Keynius SLG Information security policy v1.5",
      "Smart Locking Group security policies v1.2",
      "SLG Beleidsregels Informatiebeveiliging Januari 2025"
    ],
    rules: [
      "When leaving your workplace, lock your screen with a password.",
      "Automatic screen security after five minutes without activity must be enabled.",
      "Office space may only be left unattended if computers are locked and the doors are closed.",
      "At the end of the workday, store laptops safely in your locker or take them home securely."
    ],
    risks: [
      "Visitors or colleagues seeing customer information on an open screen",
      "Misuse of an open session while you are away for one minute",
      "Meeting rooms and shared desks creating false trust",
      "Home working without the same clear-screen discipline"
    ],
    image: "assets/images/lock-screen.svg",
    theme: { primary: "#0437A0", secondary: "#09896D" },
    questions: [
      {
        prompt: "You go to the printer for less than a minute. What should happen first?",
        choices: [
          {
            text: "Leave it because auto-lock will soon start.",
            correct: false,
            feedback: "Auto-lock is a backup, not the main habit."
          },
          {
            text: "Turn the monitor off and leave the session open.",
            correct: false,
            feedback: "A dark screen is not the same as a locked session."
          },
          {
            text: "Lock the screen before walking away.",
            correct: true,
            feedback: "Correct. One minute is enough for access or accidental disclosure."
          },
          {
            text: "Ask a nearby colleague to watch the laptop instead.",
            correct: false,
            feedback: "A person nearby is not a replacement for locking the device."
          }
        ]
      },
      {
        prompt: "Why is clear-screen behavior important in normal office life?",
        choices: [
          {
            text: "Because access can be abused very quickly by anyone near the device.",
            correct: true,
            feedback: "Correct. Fast misuse is exactly why clear-screen rules exist."
          },
          {
            text: "Because locked screens make devices run faster.",
            correct: false,
            feedback: "The purpose is access control, not performance."
          },
          {
            text: "Because only visitors are a risk.",
            correct: false,
            feedback: "Any unauthorized access is a risk, not only visitors."
          },
          {
            text: "Because open sessions are allowed if no customer file is visible.",
            correct: false,
            feedback: "An open session can still reveal mail, systems, and internal information."
          }
        ]
      },
      {
        prompt: "You step out of a meeting room that still contains other people. What is the safest action?",
        choices: [
          {
            text: "Lock the laptop before leaving the room.",
            correct: true,
            feedback: "Correct. A trusted setting is not the same as an open session permission."
          },
          {
            text: "Leave it unlocked because the room is internal.",
            correct: false,
            feedback: "Internal rooms still require access control."
          },
          {
            text: "Close the lid halfway.",
            correct: false,
            feedback: "Unless it actually locks the session, it is not enough."
          },
          {
            text: "Minimize the windows so sensitive files are hidden.",
            correct: false,
            feedback: "Minimizing windows does not secure the active session."
          }
        ]
      },
      {
        prompt: "What is the best role of the five-minute auto-lock?",
        choices: [
          {
            text: "The only lock you need.",
            correct: false,
            feedback: "Policy expects you to lock manually when stepping away."
          },
          {
            text: "Something to disable if it feels inconvenient.",
            correct: false,
            feedback: "It is a required protection, not an optional feature."
          },
          {
            text: "A setting that matters only for office desktops, not laptops.",
            correct: false,
            feedback: "The principle matters on laptops as well."
          },
          {
            text: "A safety net in case someone forgets, not the main control.",
            correct: true,
            feedback: "Correct. Good habits should not depend on the timeout."
          }
        ]
      },
      {
        prompt: "Which statement fits the policy best?",
        choices: [
          {
            text: "Lock only when sensitive files are open.",
            correct: false,
            feedback: "You cannot predict what a person might access in an open session."
          },
          {
            text: "Lock only at the end of the day.",
            correct: false,
            feedback: "The rule applies during the day as well."
          },
          {
            text: "If you leave your workplace, lock the screen every time.",
            correct: true,
            feedback: "Correct. That is the expected baseline behavior."
          },
          {
            text: "Locking is optional if the room door is closed.",
            correct: false,
            feedback: "The screen still needs to be locked."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 5",
    title: "Use AI Safely and Deliberately",
    duration: "4 min",
    summary:
      "AI may help with work, but it must never become a hidden channel for customer data, confidential information, or unchecked output.",
    explanation:
      "The company procedure allows AI as support for research, reports, communication, and software development, but only with human supervision and approved tools. The line is clear: no confidential company information, personal data, customer details, pricing, usernames, or similar sensitive material may be entered without explicit approval.",
    documents: [
      "Procedure safe use AI v1.0",
      "Keynius SLG Information security policy v1.5"
    ],
    rules: [
      "Use only AI tools approved by the Security Officer.",
      "Do not enter confidential company information or personal data into AI tools unless explicitly approved.",
      "Do not use AI for legal or financial decisions without human review.",
      "Avoid storing generated content in unsecured environments such as public cloud without encryption.",
      "New AI initiatives should be reported in advance for a risk assessment."
    ],
    risks: [
      "Pasting customer names, addresses, customer numbers, pricing, or internal strategy into AI tools",
      "Trusting AI output without checking it",
      "Uploading documents into unapproved tools because it is fast",
      "Assuming deleted prompts or chats remove all exposure"
    ],
    image: "assets/images/ai-safe.svg",
    theme: { primary: "#0044CE", secondary: "#19C29D" },
    questions: [
      {
        prompt: "You want AI help writing a customer escalation summary. What is acceptable?",
        choices: [
          {
            text: "Paste the full customer thread with names and contract details.",
            correct: false,
            feedback: "That would expose confidential and personal data."
          },
          {
            text: "Upload the pricing sheet so the answer is more precise.",
            correct: false,
            feedback: "Internal pricing is sensitive information."
          },
          {
            text: "Use a sanitized version with no traceable personal or confidential details and verify the output yourself.",
            correct: true,
            feedback: "Correct. Sanitization plus human review is the safe baseline."
          },
          {
            text: "Ask AI to summarize the raw complaint and remove names afterwards.",
            correct: false,
            feedback: "The unsafe sharing already happened before any later editing."
          }
        ]
      },
      {
        prompt: "What is the main rule before using a new AI workflow at work?",
        choices: [
          {
            text: "Use any public AI tool if it is popular.",
            correct: false,
            feedback: "Popularity is not the same as approval."
          },
          {
            text: "Use it first and ask later if it helped.",
            correct: false,
            feedback: "Approval should come before risky data use, not after."
          },
          {
            text: "Only ask permission if the output is going to a client.",
            correct: false,
            feedback: "The risk starts with the workflow and the data, not only the audience of the output."
          },
          {
            text: "Check whether the tool and use case are approved and ask for a risk assessment if needed.",
            correct: true,
            feedback: "Correct. New AI uses should be assessed before they become normal behavior."
          }
        ]
      },
      {
        prompt: "Why is 'the answer looked good' not enough with AI?",
        choices: [
          {
            text: "Because AI may only be used by developers.",
            correct: false,
            feedback: "The rule is about human review and approved use, not one department."
          },
          {
            text: "Because AI output still needs human verification for accuracy, ethics, and business impact.",
            correct: true,
            feedback: "Correct. Good-looking output can still be wrong or unsafe."
          },
          {
            text: "Because AI can never be used at work.",
            correct: false,
            feedback: "AI may be used within the approved boundaries."
          },
          {
            text: "Because tools always store every answer permanently.",
            correct: false,
            feedback: "Storage behavior is one concern, but the core policy point here is human verification."
          }
        ]
      },
      {
        prompt: "A colleague says: 'I deleted the AI chat, so it is fine.' What is the correct response?",
        choices: [
          {
            text: "That makes any prompt safe.",
            correct: false,
            feedback: "Deletion does not automatically remove risk."
          },
          {
            text: "That only matters for public companies.",
            correct: false,
            feedback: "The rule applies to our own confidential and customer information."
          },
          {
            text: "The problem is the original sharing of sensitive data, not only what happens afterwards.",
            correct: true,
            feedback: "Correct. Deleting later does not erase the initial exposure decision."
          },
          {
            text: "Deletion is enough if the prompt was work-related.",
            correct: false,
            feedback: "Work relevance does not make sensitive input acceptable."
          }
        ]
      },
      {
        prompt: "Which of these is closest to the safe AI mindset?",
        choices: [
          {
            text: "Use AI as a helper, not as an uncontrolled place to store company knowledge.",
            correct: true,
            feedback: "Correct. AI should support work, not become a data leak channel."
          },
          {
            text: "AI can replace review if the prompt is good enough.",
            correct: false,
            feedback: "Human supervision remains required."
          },
          {
            text: "Only the final output matters, not the input.",
            correct: false,
            feedback: "The input can already create a security issue."
          },
          {
            text: "If the model is advanced, sensitive prompts are acceptable.",
            correct: false,
            feedback: "Model quality does not remove confidentiality obligations."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 6",
    title: "Email Is Still One of the Easiest Attack Paths",
    duration: "4 min",
    summary:
      "Email risk is not only phishing. It is also misdelivery, urgency, spoofing, attachments, and people acting too quickly.",
    explanation:
      "Safe email behavior is about slowing down at the right moment. Check the sender, the real destination, the attachment, the tone, and the recipient list before you click or send. One wrong address or one rushed click can become a data leak very quickly.",
    documents: [
      "Smart Locking Group security policies v1.2",
      "Keynius SLG Information security policy v1.5"
    ],
    rules: [
      "Email is strictly for business use.",
      "Send email only to the person who is supposed to receive it and avoid unnecessary CC.",
      "Do not click links or download files from unknown or untrustworthy sources.",
      "Personal-device email access requires permission, password protection, and secure configuration.",
      "Report suspicious emails, suspicious files, and suspected data leaks immediately."
    ],
    risks: [
      "Spoofed senders and urgent payment or login requests",
      "Wrong-recipient emails caused by auto-complete",
      "Unexpected attachments or links from familiar-looking contacts",
      "Email on personal devices without the required security controls"
    ],
    image: "assets/images/email-safe.svg",
    theme: { primary: "#1582F1", secondary: "#0A624F" },
    questions: [
      {
        prompt: "You receive an urgent invoice email from a known partner, but the bank details changed. What should you do?",
        choices: [
          {
            text: "Reply in the same email thread for confirmation.",
            correct: false,
            feedback: "If the thread is compromised, you stay inside the attacker's channel."
          },
          {
            text: "Pay quickly to avoid delay.",
            correct: false,
            feedback: "Urgency is a classic pressure tactic."
          },
          {
            text: "Verify through a separate trusted channel and report the suspicious email internally.",
            correct: true,
            feedback: "Correct. Independent verification is the safe response to possible spoofing."
          },
          {
            text: "Forward it to several colleagues and ask if anyone recognizes it.",
            correct: false,
            feedback: "That spreads the suspicious message without verifying it."
          }
        ]
      },
      {
        prompt: "Auto-complete adds an extra external recipient to an email with customer information. What should happen before sending?",
        choices: [
          {
            text: "Send it anyway because the person may ignore it.",
            correct: false,
            feedback: "That still creates an unnecessary disclosure."
          },
          {
            text: "Move the person to CC so it is less serious.",
            correct: false,
            feedback: "CC still shares the data."
          },
          {
            text: "Remove the unintended recipient and re-check all addresses carefully.",
            correct: true,
            feedback: "Correct. Wrong-recipient emails are common and preventable."
          },
          {
            text: "Replace the attachment name and continue.",
            correct: false,
            feedback: "Renaming the file does not remove the misdelivery risk."
          }
        ]
      },
      {
        prompt: "What is the safest reaction to an unexpected attachment from a familiar name?",
        choices: [
          {
            text: "Open it because you know the sender.",
            correct: false,
            feedback: "Trusting the display name alone is not safe."
          },
          {
            text: "Pause and verify before opening it.",
            correct: true,
            feedback: "Correct. Familiar-looking names can still be compromised or spoofed."
          },
          {
            text: "Forward it to a colleague to test it.",
            correct: false,
            feedback: "That spreads the possible risk."
          },
          {
            text: "Download it first and scan it later if it looks odd.",
            correct: false,
            feedback: "The safer decision point is before opening or downloading."
          }
        ]
      },
      {
        prompt: "You receive a Microsoft 365 login warning that says your password expires today and asks you to sign in through a link. What is the safest response?",
        choices: [
          {
            text: "Click the link quickly if the branding looks right.",
            correct: false,
            feedback: "Branding is easy to copy. The safest response is not based on appearance alone."
          },
          {
            text: "Open a new browser window, go to the official login page yourself, and verify whether the warning is real.",
            correct: true,
            feedback: "Correct. Independent navigation is much safer than using a link inside a pressure email."
          },
          {
            text: "Reply to the email and ask whether the message is legitimate.",
            correct: false,
            feedback: "If the sender is spoofed or compromised, replying stays inside the attacker's channel."
          },
          {
            text: "Forward the email to a colleague and let them test the link first.",
            correct: false,
            feedback: "That spreads the suspicious message and does not verify it safely."
          }
        ]
      },
      {
        prompt: "What is the best default mindset before clicking an email link?",
        choices: [
          {
            text: "If the logo looks right, click.",
            correct: false,
            feedback: "Branding is easy to fake."
          },
          {
            text: "Click first and decide afterwards.",
            correct: false,
            feedback: "The decision point should come before the click."
          },
          {
            text: "Check who sent it, where it really goes, and whether the request makes sense.",
            correct: true,
            feedback: "Correct. Safe email behavior starts with verification."
          },
          {
            text: "Only check links when the sender is unknown.",
            correct: false,
            feedback: "Compromised or spoofed familiar senders are also common."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 7",
    title: "Report Incidents Fast and Clearly",
    duration: "2 min",
    summary:
      "Fast reporting reduces damage, protects clients, and gives the company time to contain and respond correctly.",
    explanation:
      "A delay in reporting often causes more harm than the original mistake. Our response plan depends on quick escalation: what happened, when it happened, and what data or systems may be involved. You do not need a full investigation before reporting. You need speed and the first useful facts.",
    documents: [
      "Security Incident Response Plan v1.0",
      "Smart Locking Group security policies v1.2",
      "Keynius SLG Information security policy v1.5"
    ],
    rules: [
      "Any suspected breach must be immediately reported to the Security Officer.",
      "Loss or theft of a data carrier must be reported immediately.",
      "The first report should include time and date, systems or data involved, and initial observations.",
      "Each incident should be registered in the incident and deviations overview."
    ],
    risks: [
      "Waiting because you hope the issue will disappear",
      "Deleting evidence before reporting",
      "Reporting too late for containment or required notifications",
      "Giving a vague report without the first useful facts"
    ],
    image: "assets/images/incident-reporting.svg",
    theme: { primary: "#0437A0", secondary: "#19C29D" },
    questions: [
      {
        prompt: "What is the first rule if you suspect a breach or a serious security issue?",
        choices: [
          {
            text: "Wait until you have the full root cause.",
            correct: false,
            feedback: "You do not need the full story before reporting."
          },
          {
            text: "Fix it quietly and only report if it gets worse.",
            correct: false,
            feedback: "That delays containment and loses time."
          },
          {
            text: "Report it immediately to the Security Officer.",
            correct: true,
            feedback: "Correct. Immediate reporting is the core rule in the incident process."
          },
          {
            text: "Delete the evidence first so the report is cleaner.",
            correct: false,
            feedback: "Evidence should not be removed before the right people assess the situation."
          }
        ]
      },
      {
        prompt: "What belongs in the first incident report?",
        choices: [
          {
            text: "Only your personal opinion on who caused it.",
            correct: false,
            feedback: "The first report should focus on facts, not blame."
          },
          {
            text: "Nothing until you have screenshots of everything.",
            correct: false,
            feedback: "Helpful evidence matters, but speed matters first."
          },
          {
            text: "Time, date, systems or data involved, and initial observations.",
            correct: true,
            feedback: "Correct. These first facts help the response team move quickly."
          },
          {
            text: "Only the final business impact after management reviews it.",
            correct: false,
            feedback: "You should report the first known facts before the full business review is complete."
          }
        ]
      },
      {
        prompt: "Why is delay so dangerous in incident handling?",
        choices: [
          {
            text: "Because reports are only allowed during office hours.",
            correct: false,
            feedback: "Incident response does not depend on convenience."
          },
          {
            text: "Because only technical incidents matter.",
            correct: false,
            feedback: "Human mistakes and data leaks also matter."
          },
          {
            text: "Because more time can mean more spread, more exposure, and less room to respond.",
            correct: true,
            feedback: "Correct. Delay reduces containment options."
          },
          {
            text: "Because management prefers shorter reports.",
            correct: false,
            feedback: "The key issue is response speed and containment, not report length."
          }
        ]
      },
      {
        prompt: "A device with company access is lost. What is the correct action?",
        choices: [
          {
            text: "Wait one day in case it turns up.",
            correct: false,
            feedback: "Waiting wastes response time."
          },
          {
            text: "Only mention it informally to a colleague.",
            correct: false,
            feedback: "Informal mention is not the incident process."
          },
          {
            text: "Report it immediately so access and follow-up action can start.",
            correct: true,
            feedback: "Correct. Lost devices are a direct incident-reporting case."
          },
          {
            text: "Log out remotely yourself and skip the report.",
            correct: false,
            feedback: "A technical action does not replace the formal reporting process."
          }
        ]
      },
      {
        prompt: "What is the best closing habit after this training?",
        choices: [
          {
            text: "If it feels small, keep it quiet.",
            correct: false,
            feedback: "Small incidents can grow when hidden."
          },
          {
            text: "Only report something once you are sure it is serious.",
            correct: false,
            feedback: "Suspicions should also be escalated early."
          },
          {
            text: "Trust your memory and avoid written process steps.",
            correct: false,
            feedback: "Reliable security depends on process and verification, not memory alone."
          },
          {
            text: "If in doubt, stop, verify, and report early.",
            correct: true,
            feedback: "Correct. That principle supports every topic in this training."
          }
        ]
      }
    ]
  },
  {
    kicker: "Topic 8",
    title: "Read and Follow the SLG Security Rules",
    duration: "2 min",
    summary:
      "This training helps, but the official SLG security rules remain the baseline that every employee is expected to read and follow.",
    explanation:
      "Awareness sessions create shared understanding, but the formal company rules are still the source you must know and apply in daily work. Read the Smart Locking Group security rules carefully, ask if something is unclear, and treat them as part of your normal working process.",
    documents: [
      "Smart Locking Group security policies v1.2",
      "SLG Beleidsregels Informatiebeveiliging Januari 2025"
    ],
    rules: [
      "Read the Smart Locking Group security rules and use them as the baseline for daily behavior.",
      "Apply the rules for clear screen, email use, passwords, customer data, home working, and incident reporting.",
      "If a rule is unclear, ask your manager or the Security Officer before taking action.",
      "Do not create your own shortcut process when the SLG rule already exists."
    ],
    risks: [
      "Remembering the training but not the actual company rule",
      "Using personal habits instead of the approved SLG process",
      "Making exceptions because a rule feels inconvenient",
      "Assuming a colleague's informal advice replaces the written policy"
    ],
    image: "assets/images/read-rules.svg",
    theme: { primary: "#0044CE", secondary: "#0A624F" },
    questions: [
      {
        prompt: "What should you do after this training if you are unsure how an SLG rule applies in practice?",
        choices: [
          {
            text: "Follow your own preference if it feels low risk.",
            correct: false,
            feedback: "Personal preference should not replace the written security rule."
          },
          {
            text: "Ask your manager or the Security Officer for clarification before acting.",
            correct: true,
            feedback: "Correct. Clarifying the rule before acting is safer than guessing."
          },
          {
            text: "Wait until someone corrects you later.",
            correct: false,
            feedback: "Security works best when uncertainty is addressed early."
          },
          {
            text: "Copy whatever a colleague usually does.",
            correct: false,
            feedback: "Informal habits do not override the official rule."
          }
        ]
      },
      {
        prompt: "Why is it important to read the actual SLG security rules and not rely only on the training session?",
        choices: [
          {
            text: "Because the written rules are the formal baseline for how we work.",
            correct: true,
            feedback: "Correct. The training supports the rules, but the written policy remains the baseline."
          },
          {
            text: "Because only the written rules matter and awareness training has no value.",
            correct: false,
            feedback: "The training helps explain the rules, but it does not replace them."
          },
          {
            text: "Because the rules apply only to managers unless shared more widely.",
            correct: false,
            feedback: "The rules apply to employees broadly, not only management."
          },
          {
            text: "Because reading the rules removes the need to report incidents.",
            correct: false,
            feedback: "Knowing the rules supports reporting; it does not replace it."
          }
        ]
      },
      {
        prompt: "Which approach best fits the right security mindset after this session?",
        choices: [
          {
            text: "Use the training as a reminder and the SLG rules as the official reference.",
            correct: true,
            feedback: "Correct. The session helps understanding, while the formal rule remains the source."
          },
          {
            text: "Use only the parts of the rules that are easiest in your role.",
            correct: false,
            feedback: "Security rules are not optional based on convenience."
          },
          {
            text: "Treat the training slides as more important than the written rules.",
            correct: false,
            feedback: "The slides support the policy; they do not outrank it."
          },
          {
            text: "Assume that daily practice is enough even if it differs from the rules.",
            correct: false,
            feedback: "Informal practice should be corrected if it conflicts with the written policy."
          }
        ]
      },
      {
        prompt: "A colleague says, 'I know the rule says one thing, but we always do it differently.' What is the best response?",
        choices: [
          {
            text: "Follow the colleague because experience matters more than policy.",
            correct: false,
            feedback: "Habit does not override the approved security rule."
          },
          {
            text: "Ignore the difference unless an incident happens.",
            correct: false,
            feedback: "Policy gaps should be clarified before something goes wrong."
          },
          {
            text: "Check the written SLG rule and clarify the correct process if needed.",
            correct: true,
            feedback: "Correct. Written policy should guide the process, not informal shortcuts."
          },
          {
            text: "Create your own personal workaround in the meantime.",
            correct: false,
            feedback: "Personal workarounds often create inconsistent and risky behavior."
          }
        ]
      },
      {
        prompt: "What is the clearest takeaway from this final topic?",
        choices: [
          {
            text: "This training replaces the need to read the formal SLG security rules.",
            correct: false,
            feedback: "The training supports the rules; it does not replace them."
          },
          {
            text: "Only IT staff need to know the written security rules in detail.",
            correct: false,
            feedback: "Every employee should understand and apply the relevant rules."
          },
          {
            text: "The written SLG rules should be read, understood, and used in daily work.",
            correct: true,
            feedback: "Correct. That is the purpose of this final flow."
          },
          {
            text: "If you attended the training once, the rules become optional reference material.",
            correct: false,
            feedback: "Attendance does not make the written rules optional."
          }
        ]
      }
    ]
  }
];

let currentTopicIndex = 0;

const topicNav = document.getElementById("topicNav");
const progressPill = document.getElementById("progressPill");
const topicStage = document.getElementById("topicStage");
const topicKicker = document.getElementById("topicKicker");
const topicDuration = document.getElementById("topicDuration");
const topicTitle = document.getElementById("topicTitle");
const topicSummary = document.getElementById("topicSummary");
const topicImage = document.getElementById("topicImage");
const topicExplanation = document.getElementById("topicExplanation");
const topicRules = document.getElementById("topicRules");
const topicRisks = document.getElementById("topicRisks");
const topicQuestions = document.getElementById("topicQuestions");
const prevTopicButton = document.getElementById("prevTopic");
const nextTopicButton = document.getElementById("nextTopic");

function renderNavigation() {
  topicNav.innerHTML = "";

  topics.forEach((topic, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `topic-nav-button${index === currentTopicIndex ? " active" : ""}`;
    button.innerHTML = `
      <span class="topic-nav-title">${topic.title}</span>
      <span class="topic-nav-meta">${topic.kicker} · ${topic.duration}</span>
    `;
    button.addEventListener("click", () => {
      currentTopicIndex = index;
      renderTopic();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    topicNav.appendChild(button);
  });
}

function renderList(target, items) {
  target.innerHTML = "";
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    target.appendChild(item);
  });
}

function renderQuestions(questions) {
  topicQuestions.innerHTML = "";
  const labels = ["A", "B", "C", "D"];

  questions.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "question-card";

    const title = document.createElement("h4");
    title.textContent = `${index + 1}. ${question.prompt}`;
    card.appendChild(title);

    const answerGrid = document.createElement("div");
    answerGrid.className = "answer-grid";

    const feedback = document.createElement("div");
    feedback.className = "answer-feedback";
    feedback.textContent = "";

    question.choices.forEach((choice) => {
      const choiceIndex = answerGrid.children.length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = `${labels[choiceIndex]}. ${choice.text}`;

      button.addEventListener("click", () => {
        [...answerGrid.children].forEach((child, childIndex) => {
          child.classList.remove("correct", "incorrect");
          child.classList.add(question.choices[childIndex].correct ? "correct" : "incorrect");
        });
        feedback.textContent = choice.feedback;
      });

      answerGrid.appendChild(button);
    });

    card.appendChild(answerGrid);
    card.appendChild(feedback);
    topicQuestions.appendChild(card);
  });
}

function renderTopic() {
  const topic = topics[currentTopicIndex];

  document.documentElement.style.setProperty("--topic-primary", topic.theme.primary);
  document.documentElement.style.setProperty("--topic-secondary", topic.theme.secondary);

  progressPill.textContent = `${currentTopicIndex + 1} / ${topics.length}`;
  topicKicker.textContent = topic.kicker;
  topicDuration.textContent = topic.duration;
  topicTitle.textContent = topic.title;
  topicSummary.textContent = topic.summary;
  topicExplanation.textContent = topic.explanation;
  topicImage.src = topic.image;
  topicImage.alt = `${topic.title} illustration`;

  renderList(topicRules, topic.rules);
  renderList(topicRisks, topic.risks);
  renderQuestions(topic.questions);
  renderNavigation();

  prevTopicButton.disabled = currentTopicIndex === 0;
  nextTopicButton.disabled = currentTopicIndex === topics.length - 1;

  topicStage.animate(
    [
      { opacity: 0.72, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 240, easing: "ease-out" }
  );
}

prevTopicButton.addEventListener("click", () => {
  if (currentTopicIndex === 0) {
    return;
  }
  currentTopicIndex -= 1;
  renderTopic();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

nextTopicButton.addEventListener("click", () => {
  if (currentTopicIndex === topics.length - 1) {
    return;
  }
  currentTopicIndex += 1;
  renderTopic();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderTopic();
