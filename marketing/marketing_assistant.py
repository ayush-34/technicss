#!/usr/bin/env python3
"""
Marketing Assistant for Technicss Structural Consultants
========================================================
A CLI tool to generate marketing content for structural audit, building
repair PMC, and consultancy services targeting cooperative housing
societies in Mumbai.

Usage:
    python marketing_assistant.py cold-call [--index N] [--society NAME] [--location LOC] [--age AGE]
    python marketing_assistant.py whatsapp [--index N] [--contact NAME] [--society NAME] [--location LOC]
    python marketing_assistant.py email [--index N] [--contact NAME] [--society NAME] [--location LOC] [--age AGE]
    python marketing_assistant.py linkedin [--index N]
    python marketing_assistant.py twitter [--index N]
    python marketing_assistant.py ideas [--category NAME]
    python marketing_assistant.py list
"""

import argparse
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from templates.cold_calling import get_all_scripts, get_script, format_script
from templates.whatsapp import get_all_messages, get_message, format_message
from templates.email_templates import get_all_templates, get_template, format_template
from templates.social_media import (
    get_linkedin_posts,
    get_twitter_posts,
    get_linkedin_post,
    get_twitter_post,
)
from templates.marketing_ideas import get_all_ideas, get_ideas_by_category, get_all_categories


def cmd_cold_call(args):
    """Display cold calling scripts."""
    if args.index is not None:
        script = get_script(args.index)
        if script is None:
            scripts = get_all_scripts()
            print(f"Error: Invalid index {args.index}. Valid range: 0-{len(scripts) - 1}")
            return
        print(f"\n{'=' * 70}")
        print(f"COLD CALLING SCRIPT: {script['name']}")
        print(f"Target: {script['target']}")
        print(f"{'=' * 70}")
        print(format_script(script, society_name=args.society, location=args.location,
                            age=args.age, contact_name=args.contact))
    else:
        scripts = get_all_scripts()
        print(f"\n{'=' * 70}")
        print("COLD CALLING SCRIPTS — Technicss Structural Consultants")
        print(f"{'=' * 70}")
        for i, script in enumerate(scripts):
            print(f"\n{'—' * 70}")
            print(f"[{i}] {script['name']}")
            print(f"    Target: {script['target']}")
            print(f"{'—' * 70}")
            print(format_script(script, society_name=args.society, location=args.location,
                                age=args.age, contact_name=args.contact))
        print(f"\nTotal: {len(scripts)} script(s)")
        print("Tip: Use --index N to display a specific script.")


def cmd_whatsapp(args):
    """Display WhatsApp outreach messages."""
    if args.index is not None:
        message = get_message(args.index)
        if message is None:
            messages = get_all_messages()
            print(f"Error: Invalid index {args.index}. Valid range: 0-{len(messages) - 1}")
            return
        print(f"\n{'=' * 70}")
        print(f"WHATSAPP MESSAGE: {message['name']}")
        print(f"Target: {message['target']}")
        print(f"{'=' * 70}")
        print(format_message(message, contact_name=args.contact, society_name=args.society,
                             location=args.location))
    else:
        messages = get_all_messages()
        print(f"\n{'=' * 70}")
        print("WHATSAPP OUTREACH MESSAGES — Technicss Structural Consultants")
        print(f"{'=' * 70}")
        for i, message in enumerate(messages):
            print(f"\n{'—' * 70}")
            print(f"[{i}] {message['name']}")
            print(f"    Target: {message['target']}")
            print(f"{'—' * 70}")
            print(format_message(message, contact_name=args.contact, society_name=args.society,
                                 location=args.location))
        print(f"\nTotal: {len(messages)} message(s)")
        print("Tip: Use --index N to display a specific message.")


def cmd_email(args):
    """Display email templates."""
    if args.index is not None:
        template = get_template(args.index)
        if template is None:
            templates = get_all_templates()
            print(f"Error: Invalid index {args.index}. Valid range: 0-{len(templates) - 1}")
            return
        subject, body = format_template(template, contact_name=args.contact,
                                        society_name=args.society, location=args.location,
                                        age=args.age)
        print(f"\n{'=' * 70}")
        print(f"EMAIL TEMPLATE: {template['name']}")
        print(f"Target: {template['target']}")
        print(f"{'=' * 70}")
        print(f"Subject: {subject}")
        print(f"{'—' * 70}")
        print(body)
    else:
        templates = get_all_templates()
        print(f"\n{'=' * 70}")
        print("EMAIL TEMPLATES — Technicss Structural Consultants")
        print(f"{'=' * 70}")
        for i, template in enumerate(templates):
            subject, body = format_template(template, contact_name=args.contact,
                                            society_name=args.society, location=args.location,
                                            age=args.age)
            print(f"\n{'—' * 70}")
            print(f"[{i}] {template['name']}")
            print(f"    Target: {template['target']}")
            print(f"{'—' * 70}")
            print(f"Subject: {subject}")
            print(f"{'—' * 70}")
            print(body)
        print(f"\nTotal: {len(templates)} template(s)")
        print("Tip: Use --index N to display a specific template.")


def cmd_linkedin(args):
    """Display LinkedIn posts."""
    if args.index is not None:
        post = get_linkedin_post(args.index)
        if post is None:
            posts = get_linkedin_posts()
            print(f"Error: Invalid index {args.index}. Valid range: 0-{len(posts) - 1}")
            return
        print(f"\n{'=' * 70}")
        print(f"LINKEDIN POST: {post['name']}")
        print(f"{'=' * 70}")
        print(post["post"])
    else:
        posts = get_linkedin_posts()
        print(f"\n{'=' * 70}")
        print("LINKEDIN POSTS — Technicss Structural Consultants")
        print(f"{'=' * 70}")
        for i, post in enumerate(posts):
            print(f"\n{'—' * 70}")
            print(f"[{i}] {post['name']}")
            print(f"{'—' * 70}")
            print(post["post"])
        print(f"\nTotal: {len(posts)} post(s)")
        print("Tip: Use --index N to display a specific post.")


def cmd_twitter(args):
    """Display Twitter/X posts."""
    if args.index is not None:
        post = get_twitter_post(args.index)
        if post is None:
            posts = get_twitter_posts()
            print(f"Error: Invalid index {args.index}. Valid range: 0-{len(posts) - 1}")
            return
        print(f"\n{'=' * 70}")
        print(f"TWITTER POST: {post['name']}")
        print(f"{'=' * 70}")
        print(post["post"])
    else:
        posts = get_twitter_posts()
        print(f"\n{'=' * 70}")
        print("TWITTER/X POSTS — Technicss Structural Consultants")
        print(f"{'=' * 70}")
        for i, post in enumerate(posts):
            print(f"\n{'—' * 70}")
            print(f"[{i}] {post['name']}")
            print(f"{'—' * 70}")
            print(post["post"])
        print(f"\nTotal: {len(posts)} post(s)")
        print("Tip: Use --index N to display a specific post.")


def cmd_ideas(args):
    """Display marketing ideas."""
    if args.category:
        category = get_ideas_by_category(args.category)
        if category is None:
            categories = get_all_categories()
            print(f"Error: Category '{args.category}' not found.")
            print(f"Available categories: {', '.join(categories)}")
            return
        print(f"\n{'=' * 70}")
        print(f"MARKETING IDEAS: {category['category']}")
        print(f"{'=' * 70}")
        for i, idea in enumerate(category["ideas"]):
            print(f"\n  {i + 1}. {idea['title']}")
            print(f"     {idea['description']}")
            print(f"     Effort: {idea['effort']} | Cost: {idea['cost']} | Impact: {idea['impact']}")
    else:
        ideas = get_all_ideas()
        print(f"\n{'=' * 70}")
        print("MARKETING IDEAS — Technicss Structural Consultants")
        print(f"{'=' * 70}")
        for category in ideas:
            print(f"\n{'—' * 70}")
            print(f"📂 {category['category']}")
            print(f"{'—' * 70}")
            for i, idea in enumerate(category["ideas"]):
                print(f"\n  {i + 1}. {idea['title']}")
                print(f"     {idea['description']}")
                print(f"     Effort: {idea['effort']} | Cost: {idea['cost']} | Impact: {idea['impact']}")
        total = sum(len(cat["ideas"]) for cat in ideas)
        print(f"\nTotal: {total} idea(s) across {len(ideas)} categories")
        print("Tip: Use --category NAME to filter by category.")


def cmd_list(args):
    """List all available content types and counts."""
    scripts = get_all_scripts()
    messages = get_all_messages()
    templates = get_all_templates()
    linkedin = get_linkedin_posts()
    twitter = get_twitter_posts()
    ideas = get_all_ideas()
    total_ideas = sum(len(cat["ideas"]) for cat in ideas)

    print(f"\n{'=' * 70}")
    print("MARKETING ASSISTANT — Technicss Structural Consultants")
    print(f"{'=' * 70}")
    print(f"\nAvailable Marketing Content:")
    print(f"{'—' * 50}")
    print(f"  {'Content Type':<30} {'Count':<10} {'Command'}")
    print(f"  {'—' * 48}")
    print(f"  {'Cold Calling Scripts':<30} {len(scripts):<10} cold-call")
    print(f"  {'WhatsApp Messages':<30} {len(messages):<10} whatsapp")
    print(f"  {'Email Templates':<30} {len(templates):<10} email")
    print(f"  {'LinkedIn Posts':<30} {len(linkedin):<10} linkedin")
    print(f"  {'Twitter/X Posts':<30} {len(twitter):<10} twitter")
    print(f"  {'Marketing Ideas':<30} {total_ideas:<10} ideas")
    print(f"{'—' * 50}")

    total = len(scripts) + len(messages) + len(templates) + len(linkedin) + len(twitter) + total_ideas
    print(f"  Total content items: {total}")

    print(f"\nCold Calling Scripts:")
    for i, s in enumerate(scripts):
        print(f"  [{i}] {s['name']}")

    print(f"\nWhatsApp Messages:")
    for i, m in enumerate(messages):
        print(f"  [{i}] {m['name']}")

    print(f"\nEmail Templates:")
    for i, t in enumerate(templates):
        print(f"  [{i}] {t['name']}")

    print(f"\nLinkedIn Posts:")
    for i, p in enumerate(linkedin):
        print(f"  [{i}] {p['name']}")

    print(f"\nTwitter/X Posts:")
    for i, p in enumerate(twitter):
        print(f"  [{i}] {p['name']}")

    print(f"\nMarketing Ideas Categories:")
    for cat in ideas:
        print(f"  📂 {cat['category']} ({len(cat['ideas'])} ideas)")


def main():
    parser = argparse.ArgumentParser(
        prog="marketing_assistant.py",
        description="Marketing Assistant — Technicss Structural Consultants. "
                    "Generate marketing content for structural audit, building repair PMC, "
                    "and consultancy services targeting housing societies in Mumbai.",
    )
    subparsers = parser.add_subparsers(dest="command", help="Content type to generate")

    # Cold call
    p_cold = subparsers.add_parser("cold-call", help="Display cold calling scripts")
    p_cold.add_argument("--index", type=int, default=None, help="Script index (0-based)")
    p_cold.add_argument("--society", default="[Society Name]", help="Society name for personalization")
    p_cold.add_argument("--location", default="[Location]", help="Location for personalization")
    p_cold.add_argument("--age", default="30+", help="Building age for personalization")
    p_cold.add_argument("--contact", default="[Contact Name]", help="Contact name for personalization")

    # WhatsApp
    p_wa = subparsers.add_parser("whatsapp", help="Display WhatsApp outreach messages")
    p_wa.add_argument("--index", type=int, default=None, help="Message index (0-based)")
    p_wa.add_argument("--contact", default="Sir/Madam", help="Contact name for personalization")
    p_wa.add_argument("--society", default="[Society Name]", help="Society name for personalization")
    p_wa.add_argument("--location", default="[Location]", help="Location for personalization")

    # Email
    p_email = subparsers.add_parser("email", help="Display email templates")
    p_email.add_argument("--index", type=int, default=None, help="Template index (0-based)")
    p_email.add_argument("--contact", default="Sir/Madam", help="Contact name for personalization")
    p_email.add_argument("--society", default="[Society Name]", help="Society name for personalization")
    p_email.add_argument("--location", default="[Location]", help="Location for personalization")
    p_email.add_argument("--age", default="30+", help="Building age for personalization")

    # LinkedIn
    p_li = subparsers.add_parser("linkedin", help="Display LinkedIn posts")
    p_li.add_argument("--index", type=int, default=None, help="Post index (0-based)")

    # Twitter
    p_tw = subparsers.add_parser("twitter", help="Display Twitter/X posts")
    p_tw.add_argument("--index", type=int, default=None, help="Post index (0-based)")

    # Ideas
    p_ideas = subparsers.add_parser("ideas", help="Display marketing ideas and strategies")
    p_ideas.add_argument("--category", default=None, help="Filter by category name")

    # List
    subparsers.add_parser("list", help="List all available content types and counts")

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        return

    commands = {
        "cold-call": cmd_cold_call,
        "whatsapp": cmd_whatsapp,
        "email": cmd_email,
        "linkedin": cmd_linkedin,
        "twitter": cmd_twitter,
        "ideas": cmd_ideas,
        "list": cmd_list,
    }

    handler = commands.get(args.command)
    if handler:
        handler(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
