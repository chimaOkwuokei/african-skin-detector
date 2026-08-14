"""
Seeds a demo roster of specialists.

    uv run python scripts/seed_demo_data.py

The practitioners are made up. The focus areas and their counts follow
published skin disease figures for Nigeria:

  eczema        20.9% of adult visits, 24.9% of child visits
  infections    72.3% prevalence in rural schoolchildren
  hiv           7.9% of adult visits
  pigmentation  5.0% of visits, plus skin lightening side effects
  hair          4.1% of visits, mostly traction alopecia
  keloid        common reason for referral
  skin_ntd      Nigeria carries about a quarter of Africa's NTD burden

"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlmodel import Session, select  # noqa: E402

from app.core.database import engine, init_db  # noqa: E402
from app.models import User  # noqa: E402

# (name, focus_area). Names are made up.
SPECIALISTS = [
    ("Dr. Ngozi Abiade", "general"),
    ("Dr. Tunde Falade", "general"),
    ("Dr. Amara Nwachi", "general"),
    ("Dr. Yusuf Danlami", "general"),
    ("Dr. Chinelo Okorie", "eczema"),
    ("Dr. Segun Adeyoola", "eczema"),
    ("Dr. Halima Bature", "infections"),
    ("Dr. Ifeanyi Modebe", "infections"),
    ("Dr. Bisi Ogunkoya", "pediatric"),
    ("Dr. Musa Garba", "pediatric"),
    ("Dr. Folake Adisa", "hair"),
    ("Dr. Uchenna Iheme", "hair"),
    ("Dr. Zainab Suleiman", "pigmentation"),
    ("Dr. Kemi Balogun", "pigmentation"),
    ("Dr. Emeka Nwafor", "hiv_dermatology"),
    ("Dr. Rukayat Oyelaran", "keloid"),
    ("Dr. Peter Achike", "skin_ntd"),
]

def main() -> None:
    init_db()
    with Session(engine) as session:
        if session.exec(select(User)).first() is not None:
            print("Database already has specialists. Nothing seeded.")
            return

        specialists = [
            User(
                name=name,
                role="specialist",
                specialty="dermatology",
                focus_area=focus,
            )
            for name, focus in SPECIALISTS
        ]
        session.add_all(specialists)
        session.commit()

        print(f"Seeded {len(specialists)} specialists.")


if __name__ == "__main__":
    main()
